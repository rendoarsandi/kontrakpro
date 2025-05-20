import { Env } from '../index';
import { generateId } from '../utils/id';
import { corsHeaders } from '../utils/cors';

// Daftar kontrak
export async function listContracts(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    const search = url.searchParams.get('search');

    // Dapatkan user ID dari session
    const user = request.user;

    // Buat query dasar
    let query = `
      SELECT c.*, u.name as owner_name, o.name as organization_name
      FROM contracts c
      JOIN users u ON c.owner_id = u.id
      JOIN organizations o ON c.organization_id = o.id
      WHERE 1=1
    `;

    // Parameter untuk query
    const params = [];

    // Filter berdasarkan status
    if (status) {
      query += ` AND c.status = ?`;
      params.push(status);
    }

    // Filter berdasarkan tipe
    if (type) {
      query += ` AND c.type = ?`;
      params.push(type);
    }

    // Filter berdasarkan pencarian
    if (search) {
      query += ` AND (c.title LIKE ? OR c.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Tambahkan ordering dan limit
    query += ` ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // Jalankan query
    const { results } = await env.DB.prepare(query)
      .bind(...params)
      .all();

    // Hitung total kontrak (untuk pagination)
    let countQuery = `
      SELECT COUNT(*) as total
      FROM contracts c
      WHERE 1=1
    `;

    // Parameter untuk query count
    const countParams = [];

    // Filter berdasarkan status
    if (status) {
      countQuery += ` AND c.status = ?`;
      countParams.push(status);
    }

    // Filter berdasarkan tipe
    if (type) {
      countQuery += ` AND c.type = ?`;
      countParams.push(type);
    }

    // Filter berdasarkan pencarian
    if (search) {
      countQuery += ` AND (c.title LIKE ? OR c.description LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    // Jalankan query count
    const { results: countResults } = await env.DB.prepare(countQuery)
      .bind(...countParams)
      .all();

    const total = countResults[0].total;

    return new Response(JSON.stringify({
      contracts: results,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + results.length < total
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to list contracts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Membuat kontrak baru
export async function createContract(request: Request, env: Env): Promise<Response> {
  try {
    const { title, description, type, organization_id } = await request.json();

    // Validasi input
    if (!title || !type || !organization_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Dapatkan user ID dari session
    const user = request.user;

    const id = generateId();
    const now = Date.now();

    // Buat kontrak baru
    await env.DB.prepare(
      `INSERT INTO contracts (id, title, description, status, type, owner_id, organization_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, title, description || '', 'draft', type, user.id, organization_id, now, now)
    .run();

    // Buat versi awal kontrak
    const versionId = generateId();
    await env.DB.prepare(
      `INSERT INTO contract_versions (id, contract_id, version, content, created_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(versionId, id, 1, '', now, user.id)
    .run();

    // Buat workflow untuk kontrak
    const workflowId = generateId();
    await env.DB.prepare(
      `INSERT INTO workflows (id, contract_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(workflowId, id, 'draft', now, now)
    .run();

    // Dapatkan detail kontrak yang baru dibuat
    const { results } = await env.DB.prepare(
      `SELECT c.*, u.name as owner_name, o.name as organization_name
       FROM contracts c
       JOIN users u ON c.owner_id = u.id
       JOIN organizations o ON c.organization_id = o.id
       WHERE c.id = ?`
    )
    .bind(id)
    .all();

    // Tambahkan log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      generateId(),
      user.id,
      'create',
      'contract',
      id,
      JSON.stringify({ title, type }),
      now
    )
    .run();

    return new Response(JSON.stringify(results[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to create contract' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Mendapatkan detail kontrak
export async function getContract(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;

    // Dapatkan detail kontrak
    const { results } = await env.DB.prepare(
      `SELECT c.*, u.name as owner_name, o.name as organization_name
       FROM contracts c
       JOIN users u ON c.owner_id = u.id
       JOIN organizations o ON c.organization_id = o.id
       WHERE c.id = ?`
    )
    .bind(id)
    .all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Contract not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Dapatkan versi kontrak terbaru
    const { results: versions } = await env.DB.prepare(
      `SELECT * FROM contract_versions
       WHERE contract_id = ?
       ORDER BY version DESC
       LIMIT 1`
    )
    .bind(id)
    .all();

    // Dapatkan workflow kontrak
    const { results: workflows } = await env.DB.prepare(
      `SELECT * FROM workflows
       WHERE contract_id = ?`
    )
    .bind(id)
    .all();

    // Dapatkan langkah-langkah workflow
    const { results: workflowSteps } = await env.DB.prepare(
      `SELECT ws.*, u.name as assignee_name
       FROM workflow_steps ws
       LEFT JOIN users u ON ws.assignee_id = u.id
       WHERE ws.workflow_id = ?
       ORDER BY ws.step_number ASC`
    )
    .bind(workflows[0]?.id || '')
    .all();

    // Dapatkan komentar kontrak
    const { results: comments } = await env.DB.prepare(
      `SELECT c.*, u.name as user_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.contract_id = ?
       ORDER BY c.created_at DESC
       LIMIT 10`
    )
    .bind(id)
    .all();

    // Dapatkan dokumen kontrak
    const { results: documents } = await env.DB.prepare(
      `SELECT d.*, u.name as uploaded_by_name
       FROM documents d
       JOIN users u ON d.uploaded_by = u.id
       WHERE d.contract_id = ?
       ORDER BY d.created_at DESC`
    )
    .bind(id)
    .all();

    const contract = {
      ...results[0],
      latest_version: versions[0] || null,
      workflow: workflows[0] || null,
      workflow_steps: workflowSteps,
      comments,
      documents
    };

    return new Response(JSON.stringify(contract), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to get contract' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Update kontrak
export async function updateContract(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;
    const { title, description, status, type } = await request.json();

    // Validasi input
    if (!title && !description && !status && !type) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Dapatkan user ID dari session
    const user = request.user;

    // Verifikasi bahwa kontrak ada
    const { results } = await env.DB.prepare(
      `SELECT * FROM contracts WHERE id = ?`
    )
    .bind(id)
    .all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Contract not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const contract = results[0];
    const now = Date.now();

    // Buat query update
    let query = `UPDATE contracts SET updated_at = ?`;
    const queryParams = [now];

    if (title) {
      query += `, title = ?`;
      queryParams.push(title);
    }

    if (description !== undefined) {
      query += `, description = ?`;
      queryParams.push(description);
    }

    if (status) {
      query += `, status = ?`;
      queryParams.push(status);
    }

    if (type) {
      query += `, type = ?`;
      queryParams.push(type);
    }

    query += ` WHERE id = ?`;
    queryParams.push(id);

    // Update kontrak
    await env.DB.prepare(query)
      .bind(...queryParams)
      .run();

    // Tambahkan log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      generateId(),
      user.id,
      'update',
      'contract',
      id,
      JSON.stringify({
        title: title || contract.title,
        description: description !== undefined ? description : contract.description,
        status: status || contract.status,
        type: type || contract.type
      }),
      now
    )
    .run();

    // Dapatkan kontrak yang diperbarui
    const { results: updatedResults } = await env.DB.prepare(
      `SELECT c.*, u.name as owner_name, o.name as organization_name
       FROM contracts c
       JOIN users u ON c.owner_id = u.id
       JOIN organizations o ON c.organization_id = o.id
       WHERE c.id = ?`
    )
    .bind(id)
    .all();

    return new Response(JSON.stringify(updatedResults[0]), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to update contract' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Hapus kontrak
export async function deleteContract(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;

    // Dapatkan user ID dari session
    const user = request.user;

    // Verifikasi bahwa kontrak ada
    const { results } = await env.DB.prepare(
      `SELECT * FROM contracts WHERE id = ?`
    )
    .bind(id)
    .all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Contract not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const now = Date.now();

    // Hapus kontrak (dalam praktiknya, mungkin lebih baik untuk "soft delete")
    await env.DB.prepare(
      `DELETE FROM contracts WHERE id = ?`
    )
    .bind(id)
    .run();

    // Tambahkan log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      generateId(),
      user.id,
      'delete',
      'contract',
      id,
      JSON.stringify({ id }),
      now
    )
    .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to delete contract' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
