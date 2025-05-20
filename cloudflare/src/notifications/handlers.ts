import { Env } from '../index';
import { generateId } from '../utils/id';
import { corsHeaders } from '../utils/cors';
import { 
  Notification, 
  NotificationType, 
  NotificationPriority, 
  NotificationStatus,
  Reminder
} from './types';

// Mendapatkan notifikasi untuk pengguna
export async function getUserNotifications(request: Request, env: Env): Promise<Response> {
  try {
    const user = request.user;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status') || null;
    
    let query = `
      SELECT * FROM notifications 
      WHERE user_id = ?
    `;
    
    const queryParams = [user.id];
    
    if (status) {
      query += ` AND status = ?`;
      queryParams.push(status);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
    
    const { results } = await env.DB.prepare(query)
      .bind(...queryParams)
      .all();
    
    return new Response(JSON.stringify({ notifications: results }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to get notifications' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Menandai notifikasi sebagai dibaca
export async function markNotificationAsRead(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;
    const user = request.user;
    const now = Date.now();
    
    // Verifikasi bahwa notifikasi ada dan milik pengguna
    const { results } = await env.DB.prepare(
      `SELECT * FROM notifications WHERE id = ? AND user_id = ?`
    )
    .bind(id, user.id)
    .all();
    
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Notification not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Update status notifikasi
    await env.DB.prepare(
      `UPDATE notifications SET status = ?, read_at = ? WHERE id = ?`
    )
    .bind(NotificationStatus.READ, now, id)
    .run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to mark notification as read' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Membuat pengingat baru
export async function createReminder(request: Request, env: Env): Promise<Response> {
  try {
    const user = request.user;
    const { title, message, resource_type, resource_id, due_date } = await request.json();
    
    // Validasi input
    if (!title || !message || !resource_type || !resource_id || !due_date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const id = generateId();
    const now = Date.now();
    
    // Simpan pengingat ke database
    await env.DB.prepare(
      `INSERT INTO reminders (id, user_id, title, message, resource_type, resource_id, due_date, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, user.id, title, message, resource_type, resource_id, due_date, 'pending', now)
    .run();
    
    const reminder: Reminder = {
      id,
      user_id: user.id,
      title,
      message,
      resource_type,
      resource_id,
      due_date,
      status: 'pending',
      created_at: now
    };
    
    return new Response(JSON.stringify(reminder), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to create reminder' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Mendapatkan pengingat untuk pengguna
export async function getUserReminders(request: Request, env: Env): Promise<Response> {
  try {
    const user = request.user;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status') || null;
    
    let query = `
      SELECT * FROM reminders 
      WHERE user_id = ?
    `;
    
    const queryParams = [user.id];
    
    if (status) {
      query += ` AND status = ?`;
      queryParams.push(status);
    }
    
    query += ` ORDER BY due_date ASC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
    
    const { results } = await env.DB.prepare(query)
      .bind(...queryParams)
      .all();
    
    return new Response(JSON.stringify({ reminders: results }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to get reminders' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
