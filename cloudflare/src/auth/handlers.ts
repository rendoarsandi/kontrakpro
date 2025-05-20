import { Env } from '../index';
import { generateId } from '../utils/id';
import { corsHeaders } from '../utils/cors';
import * as bcrypt from 'bcryptjs';

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
