import { Env } from '../index';
import { generateId } from '../utils/id';
import { corsHeaders } from '../utils/cors';

// Fungsi untuk mengupload dokumen ke R2
export async function uploadDocument(request: Request, env: Env): Promise<Response> {
  try {
    // Pastikan request adalah multipart/form-data
    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'Content-Type must be multipart/form-data' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const contractId = formData.get('contractId') as string;

    // Validasi input
    if (!file || !contractId) {
      return new Response(JSON.stringify({ error: 'File and contractId are required' }), {
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
    const { results: contractResults } = await env.DB.prepare(
      `SELECT * FROM contracts WHERE id = ?`
    )
    .bind(contractId)
    .all();

    if (contractResults.length === 0) {
      return new Response(JSON.stringify({ error: 'Contract not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Generate ID unik untuk dokumen
    const documentId = generateId();
    const now = Date.now();

    // Generate key untuk R2
    const r2Key = `${contractId}/${documentId}/${file.name}`;

    // Upload file ke R2
    await env.DOCUMENTS.put(r2Key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      }
    });

    // Simpan metadata dokumen di database
    await env.DB.prepare(
      `INSERT INTO documents (id, contract_id, filename, content_type, size, r2_key, uploaded_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      documentId,
      contractId,
      file.name,
      file.type,
      file.size,
      r2Key,
      user.id,
      now
    )
    .run();

    // Tambahkan log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      generateId(),
      user.id,
      'upload',
      'document',
      documentId,
      JSON.stringify({ filename: file.name, contract_id: contractId }),
      now
    )
    .run();

    // Dapatkan detail dokumen yang baru diupload
    const { results: documentResults } = await env.DB.prepare(
      `SELECT d.*, u.name as uploaded_by_name
       FROM documents d
       JOIN users u ON d.uploaded_by = u.id
       WHERE d.id = ?`
    )
    .bind(documentId)
    .all();

    return new Response(JSON.stringify(documentResults[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to upload document' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk mendownload dokumen dari R2
export async function downloadDocument(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const documentId = params.id;

    // Dapatkan metadata dokumen dari database
    const { results } = await env.DB.prepare(
      `SELECT * FROM documents WHERE id = ?`
    )
    .bind(documentId)
    .all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const document = results[0];

    // Dapatkan file dari R2
    const r2Object = await env.DOCUMENTS.get(document.r2_key);

    if (!r2Object) {
      return new Response(JSON.stringify({ error: 'Document file not found in storage' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Tambahkan log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      generateId(),
      request.user.id,
      'download',
      'document',
      documentId,
      JSON.stringify({ filename: document.filename, contract_id: document.contract_id }),
      Date.now()
    )
    .run();

    // Return file sebagai response
    return new Response(r2Object.body, {
      headers: {
        'Content-Type': document.content_type,
        'Content-Disposition': `attachment; filename="${document.filename}"`,
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to download document' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk mendapatkan daftar dokumen untuk kontrak tertentu
export async function listDocuments(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const contractId = url.searchParams.get('contractId');

    if (!contractId) {
      return new Response(JSON.stringify({ error: 'contractId is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Dapatkan daftar dokumen dari database
    const { results } = await env.DB.prepare(
      `SELECT d.*, u.name as uploaded_by_name
       FROM documents d
       JOIN users u ON d.uploaded_by = u.id
       WHERE d.contract_id = ?
       ORDER BY d.created_at DESC`
    )
    .bind(contractId)
    .all();

    return new Response(JSON.stringify({ documents: results }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to list documents' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk menghapus dokumen
export async function deleteDocument(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const documentId = params.id;

    // Dapatkan metadata dokumen dari database
    const { results } = await env.DB.prepare(
      `SELECT * FROM documents WHERE id = ?`
    )
    .bind(documentId)
    .all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const document = results[0];

    // Hapus file dari R2
    await env.DOCUMENTS.delete(document.r2_key);

    // Hapus metadata dari database
    await env.DB.prepare(
      `DELETE FROM documents WHERE id = ?`
    )
    .bind(documentId)
    .run();

    // Tambahkan log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      generateId(),
      request.user.id,
      'delete',
      'document',
      documentId,
      JSON.stringify({ filename: document.filename, contract_id: document.contract_id }),
      Date.now()
    )
    .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to delete document' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
