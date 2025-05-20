import { Env } from '../index';
import { generateId } from '../utils/id';

// Placeholder untuk tipe Request dengan user
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export async function addCommentHandler(request: AuthenticatedRequest, env: Env): Promise<Response> {
  try {
    const { contract_id, content, parent_comment_id } = await request.json() as { contract_id: string, content: string, parent_comment_id?: string };
    const user = request.user;

    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!contract_id || !content) {
      return new Response(JSON.stringify({ error: 'Missing contract_id or content' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Validasi apakah user memiliki akses ke kontrak ini

    const id = generateId();
    const now = Date.now();

    // TODO: Simpan komentar ke database (tabel comments) setelah masalah migrasi D1 teratasi.
    //       Perhatikan field parent_comment_id untuk threading.
    // await env.DB.prepare(
    //   `INSERT INTO comments (id, contract_id, user_id, content, parent_comment_id, created_at)
    //    VALUES (?, ?, ?, ?, ?, ?)`
    // )
    // .bind(id, contract_id, user.id, content, parent_comment_id || null, now)
    // .run();

    return new Response(JSON.stringify({
      id,
      contract_id,
      user_id: user.id,
      content,
      parent_comment_id: parent_comment_id || null,
      created_at: now,
      message: 'Comment added (database operation skipped)'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error adding comment:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to add comment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function getCommentsHandler(request: AuthenticatedRequest, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const contractId = url.searchParams.get('contract_id');

    if (!contractId) {
      return new Response(JSON.stringify({ error: 'Missing contract_id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Validasi apakah user memiliki akses ke kontrak ini

    // TODO: Ambil komentar dari database, mungkin dengan join ke tabel users untuk info user.
    //       Urutkan berdasarkan created_at. Handle threading jika diperlukan.
    // const { results: comments } = await env.DB.prepare(
    //   `SELECT c.*, u.name as user_name, u.email as user_email 
    //    FROM comments c JOIN users u ON c.user_id = u.id 
    //    WHERE c.contract_id = ? ORDER BY c.created_at ASC`
    // )
    // .bind(contractId)
    // .all();

    return new Response(JSON.stringify({
      comments: [], // comments
      message: 'Comments fetched (database operation skipped)'
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch comments' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// TODO: Implementasikan handler untuk update/delete komentar, real-time (WebSockets), dll.
