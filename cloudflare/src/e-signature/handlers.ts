import { Env } from '../index';
import { generateId } from '../utils/id';
// import { authenticate } from '../auth/middleware'; // Akan diaktifkan nanti

// Placeholder untuk tipe Request dengan user
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export async function createSignatureRequestHandler(request: AuthenticatedRequest, env: Env): Promise<Response> {
  try {
    const { contract_id } = await request.json() as { contract_id: string };

    if (!contract_id) {
      return new Response(JSON.stringify({ error: 'Missing contract_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Validasi apakah user memiliki akses ke kontrak
    // const user = request.user;
    // if (!user) {
    //   return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }

    const id = generateId();
    const now = Date.now();

    // TODO: Simpan ke database setelah masalah migrasi teratasi
    // await env.DB.prepare(
    //   `INSERT INTO e_signature_requests (id, contract_id, status, created_at, updated_at)
    //    VALUES (?, ?, ?, ?, ?)`
    // )
    // .bind(id, contract_id, 'pending', now, now)
    // .run();

    return new Response(JSON.stringify({
      id,
      contract_id,
      status: 'pending',
      created_at: now,
      updated_at: now,
      message: 'Signature request created (database operation skipped due to migration issue)',
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error creating signature request:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create signature request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function getSignatureRequestHandler(request: AuthenticatedRequest, env: Env): Promise<Response> {
  try {
    const requestId = (request as any).params?.id; // Asumsi itty-router menambahkan params

    if (!requestId) {
      return new Response(JSON.stringify({ error: 'Missing request_id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Validasi apakah user memiliki akses ke request ini

    // TODO: Ambil data dari database setelah masalah migrasi teratasi
    // const { results: requestDetails } = await env.DB.prepare(
    //   `SELECT * FROM e_signature_requests WHERE id = ?`
    // )
    // .bind(requestId)
    // .all();

    // if (requestDetails.length === 0) {
    //   return new Response(JSON.stringify({ error: 'Signature request not found' }), {
    //     status: 404,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }

    // const { results: signers } = await env.DB.prepare(
    //   `SELECT * FROM e_signature_signers WHERE request_id = ? ORDER BY created_at ASC`
    // )
    // .bind(requestId)
    // .all();

    return new Response(JSON.stringify({
      // ...requestDetails[0],
      // signers,
      id: requestId,
      message: 'Signature request details fetched (database operation skipped)',
      // Mock data sementara:
      contract_id: 'mock_contract_id',
      status: 'pending',
      created_at: Date.now(),
      updated_at: Date.now(),
      signers: [] 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error getting signature request:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to get signature request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function addSignerToRequestHandler(request: AuthenticatedRequest, env: Env): Promise<Response> {
  try {
    const requestId = (request as any).params?.id;
    const { email, name } = await request.json() as { email: string, name: string };

    if (!requestId) {
      return new Response(JSON.stringify({ error: 'Missing request_id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!email || !name) {
      return new Response(JSON.stringify({ error: 'Missing email or name for signer' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Validasi apakah user memiliki akses untuk menambah signer ke request ini
    // TODO: Validasi apakah request masih dalam status yang memperbolehkan penambahan signer

    const signerId = generateId();
    const now = Date.now();

    // TODO: Simpan signer ke database setelah masalah migrasi teratasi
    // await env.DB.prepare(
    //   `INSERT INTO e_signature_signers (id, request_id, email, name, status, created_at, updated_at)
    //    VALUES (?, ?, ?, ?, ?, ?, ?)`
    // )
    // .bind(signerId, requestId, email, name, 'pending', now, now)
    // .run();

    return new Response(JSON.stringify({
      id: signerId,
      request_id: requestId,
      email,
      name,
      status: 'pending',
      created_at: now,
      updated_at: now,
      message: 'Signer added (database operation skipped)',
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error adding signer to request:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to add signer' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function updateSignerStatusHandler(request: AuthenticatedRequest, env: Env): Promise<Response> {
  try {
    const requestId = (request as any).params?.id;
    const signerId = (request as any).params?.signerId;
    const { status, signed_document_key } = await request.json() as { status: string, signed_document_key?: string };

    if (!requestId || !signerId) {
      return new Response(JSON.stringify({ error: 'Missing request_id or signer_id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!status) {
      return new Response(JSON.stringify({ error: 'Missing status for signer' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validasi status yang diperbolehkan: 'signed', 'declined'
    if (!['signed', 'declined'].includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status value' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (status === 'signed' && !signed_document_key) {
      return new Response(JSON.stringify({ error: 'Missing signed_document_key for signed status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Validasi apakah user memiliki akses untuk mengubah status signer ini
    // TODO: Validasi apakah request dan signer ada dan dalam status yang valid

    const now = Date.now();
    let signedAt: number | null = null;
    if (status === 'signed') {
      signedAt = now;
    }

    // TODO: Update status signer di database setelah masalah migrasi teratasi
    // await env.DB.prepare(
    //   `UPDATE e_signature_signers 
    //    SET status = ?, updated_at = ?, signed_at = ?, signed_document_key = ? 
    //    WHERE id = ? AND request_id = ?`
    // )
    // .bind(status, now, signedAt, signed_document_key || null, signerId, requestId)
    // .run();

    // TODO: Jika semua signer sudah 'signed', update status e_signature_requests menjadi 'completed'

    return new Response(JSON.stringify({
      id: signerId,
      request_id: requestId,
      status,
      signed_at: signedAt,
      signed_document_key: signed_document_key || null,
      updated_at: now,
      message: 'Signer status updated (database operation skipped)',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error updating signer status:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to update signer status' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// TODO: Implementasikan handler lain (misalnya untuk membatalkan request, mengirim ulang notifikasi, dll.)
