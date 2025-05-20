import { Env } from '../index';
import { generateId } from '../utils/id';
import { corsHeaders } from '../utils/cors';
import * as bcrypt from 'bcryptjs';

// Fungsi untuk membuat user default jika belum ada
export async function createDefaultUserIfNotExists(env: Env): Promise<void> {
  try {
    // Cek apakah user default sudah ada
    const { results } = await env.DB.prepare(
      `SELECT id FROM users WHERE email = ?`
    )
    .bind('user@example.com')
    .all();

    if (results.length === 0) {
      // User belum ada, buat user default
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash('admin1234', salt);

      const userId = generateId();
      const now = Date.now();

      // Cek apakah organisasi default sudah ada
      const { results: orgResults } = await env.DB.prepare(
        `SELECT id FROM organizations WHERE name = ?`
      )
      .bind('Default Organization')
      .all();

      let orgId;
      if (orgResults.length === 0) {
        // Organisasi belum ada, buat organisasi default
        orgId = generateId();
        await env.DB.prepare(
          `INSERT INTO organizations (id, name, created_at, updated_at)
           VALUES (?, ?, ?, ?)`
        )
        .bind(orgId, 'Default Organization', now, now)
        .run();
      } else {
        orgId = orgResults[0].id;
      }

      // Buat user default
      await env.DB.prepare(
        `INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at, auth_provider)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(userId, 'user@example.com', 'Admin User', password_hash, 'admin', now, now, 'email')
      .run();

      console.log('User default berhasil dibuat');
    }
  } catch (error) {
    console.error('Gagal membuat user default:', error);
  }
}

// Fungsi untuk login
export async function login(request: Request, env: Env): Promise<Response> {
  try {
    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Cari user berdasarkan email
    const { results } = await env.DB.prepare(
      `SELECT * FROM users WHERE email = ?`
    )
    .bind(email)
    .all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const user = results[0];

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Buat token dan session
    const token = generateId();
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 jam

    // Simpan session di KV
    await env.SESSIONS.put(token, JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      expires
    }));

    // Hapus password_hash dari respons
    delete user.password_hash;

    return new Response(JSON.stringify({
      token,
      expires,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Login failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk signup
export async function signup(request: Request, env: Env): Promise<Response> {
  try {
    const { email, password, name, organization_name } = await request.json();

    // Validasi input
    if (!email || !password || !name || !organization_name) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Cek apakah email sudah digunakan
    const { results } = await env.DB.prepare(
      `SELECT id FROM users WHERE email = ?`
    )
    .bind(email)
    .all();

    if (results.length > 0) {
      return new Response(JSON.stringify({ error: 'Email already in use' }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Buat ID untuk user dan organization
    const userId = generateId();
    const orgId = generateId();
    const now = Date.now();

    // Mulai transaksi
    const db = env.DB;

    // Buat organization
    await db.prepare(
      `INSERT INTO organizations (id, name, created_at, updated_at)
       VALUES (?, ?, ?, ?)`
    )
    .bind(orgId, organization_name, now, now)
    .run();

    // Buat user
    await db.prepare(
      `INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(userId, email, name, password_hash, 'admin', now, now)
    .run();

    // Buat token dan session
    const token = generateId();
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 jam

    // Simpan session di KV
    await env.SESSIONS.put(token, JSON.stringify({
      user: {
        id: userId,
        email,
        name,
        role: 'admin'
      },
      expires
    }));

    return new Response(JSON.stringify({
      token,
      expires,
      user: {
        id: userId,
        email,
        name,
        role: 'admin'
      },
      organization: {
        id: orgId,
        name: organization_name
      }
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Signup failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk refresh token
export async function refreshToken(request: Request, env: Env): Promise<Response> {
  try {
    const { token } = await request.json();

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Dapatkan session dari KV
    const sessionData = await env.SESSIONS.get(token);
    if (!sessionData) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Parse data session
    const session = JSON.parse(sessionData);

    // Verifikasi bahwa session belum kedaluwarsa
    if (session.expires < Date.now()) {
      await env.SESSIONS.delete(token);
      return new Response(JSON.stringify({ error: 'Token expired' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Buat token baru
    const newToken = generateId();
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 jam

    // Simpan session baru di KV
    await env.SESSIONS.put(newToken, JSON.stringify({
      user: session.user,
      expires
    }));

    // Hapus token lama
    await env.SESSIONS.delete(token);

    return new Response(JSON.stringify({
      token: newToken,
      expires,
      user: session.user
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Token refresh failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk logout
export async function logout(request: Request, env: Env): Promise<Response> {
  try {
    const { token } = await request.json();

    if (token) {
      // Hapus session dari KV
      await env.SESSIONS.delete(token);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Logout failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk autentikasi dengan Google Zero Trust
export async function googleAuth(request: Request, env: Env): Promise<Response> {
  try {
    // Dapatkan header CF-Access-JWT-Assertion yang dikirim oleh Cloudflare Access
    const accessJWT = request.headers.get('CF-Access-JWT-Assertion');

    if (!accessJWT) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing CF-Access-JWT-Assertion header' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Decode JWT (dalam implementasi sebenarnya, Anda harus memverifikasi JWT)
    // Untuk contoh ini, kita asumsikan JWT valid dan berisi informasi user
    const jwtParts = accessJWT.split('.');
    if (jwtParts.length !== 3) {
      return new Response(JSON.stringify({ error: 'Invalid JWT format' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Decode payload JWT (bagian kedua)
    const payload = JSON.parse(atob(jwtParts[1]));

    // Dapatkan informasi user dari payload
    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const googleId = payload.sub; // Subject ID dari Google

    if (!email) {
      return new Response(JSON.stringify({ error: 'Invalid JWT: Missing email' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Cek apakah user sudah ada di database
    const { results } = await env.DB.prepare(
      `SELECT * FROM users WHERE email = ? OR google_id = ?`
    )
    .bind(email, googleId)
    .all();

    let user;
    const now = Date.now();

    if (results.length === 0) {
      // User belum ada, buat user baru
      const userId = generateId();

      // Cek apakah ada organisasi default
      const { results: orgResults } = await env.DB.prepare(
        `SELECT id FROM organizations LIMIT 1`
      )
      .all();

      let orgId;
      if (orgResults.length === 0) {
        // Buat organisasi default jika belum ada
        orgId = generateId();
        await env.DB.prepare(
          `INSERT INTO organizations (id, name, created_at, updated_at)
           VALUES (?, ?, ?, ?)`
        )
        .bind(orgId, 'Default Organization', now, now)
        .run();
      } else {
        orgId = orgResults[0].id;
      }

      // Buat user baru
      await env.DB.prepare(
        `INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at, google_id, auth_provider)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(userId, email, name, '', 'user', now, now, googleId, 'google')
      .run();

      user = {
        id: userId,
        email,
        name,
        role: 'user',
        google_id: googleId,
        auth_provider: 'google'
      };
    } else {
      user = results[0];

      // Update informasi user jika perlu
      if (user.google_id !== googleId || user.auth_provider !== 'google') {
        await env.DB.prepare(
          `UPDATE users SET google_id = ?, auth_provider = ?, updated_at = ? WHERE id = ?`
        )
        .bind(googleId, 'google', now, user.id)
        .run();

        user.google_id = googleId;
        user.auth_provider = 'google';
      }
    }

    // Buat token dan session
    const token = generateId();
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 jam

    // Simpan session di KV
    await env.SESSIONS.put(token, JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        auth_provider: user.auth_provider
      },
      expires
    }));

    // Hapus password_hash dari respons
    delete user.password_hash;

    return new Response(JSON.stringify({
      token,
      expires,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        auth_provider: user.auth_provider
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Google authentication failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
