import { Env } from '../index';
import { corsHeaders } from '../utils/cors';

// Middleware untuk autentikasi
export async function authenticate(request: Request, env: Env): Promise<Response | void> {
  try {
    // Dapatkan token dari header Authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Dapatkan session dari KV
    const sessionData = await env.SESSIONS.get(token);
    if (!sessionData) {
      return new Response(JSON.stringify({ error: 'Invalid or expired session' }), {
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
      return new Response(JSON.stringify({ error: 'Session expired' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Tambahkan data user ke request untuk digunakan oleh handler
    request.user = session.user;
    
    // Lanjutkan ke handler berikutnya
    return;
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Authentication error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
