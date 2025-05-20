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
    // TODO: Create e-signature request in database
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

// Handler untuk memulai proses penandatanganan
export async function initiateSigningProcessHandler(request: AuthenticatedRequest, env: Env): Promise<Response> {
  try {
    const requestId = (request as any).params?.id;

    if (!requestId) {
      return new Response(JSON.stringify({ error: 'Missing request_id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Validasi apakah user memiliki akses untuk memulai proses ini
    // TODO: Validasi apakah request ada dan dalam status yang valid (misal: 'pending', belum dimulai)
    // TODO: Ambil data request dan signers dari database
    // TODO: Dapatkan dokumen yang akan ditandatangani (misal dari R2)
    // TODO: Interaksi dengan penyedia tanda tangan elektronik (misal DocuSign, Adobe Sign)
    // Ini melibatkan mengirim dokumen, daftar penandatangan, dan konfigurasi lainnya ke API penyedia.
    // Penyedia akan mengembalikan URL atau ID untuk memulai proses penandatanganan.

    console.log(`TODO: Integrate with e-signature provider for request ${requestId}`);

    // TODO: Update status request menjadi 'in_progress' di database dan simpan provider_request_id/url jika ada
    // TODO: Call the e-signature provider API (e.g., send document, signers)
    const signingUrl = `mock_signing_url_for_request_${requestId}`; // Replace with actual URL from provider
    // Placeholder respons
    return new Response(JSON.stringify({
      request_id: requestId,
      status: 'in_progress',
      signing_url: `mock_signing_url_for_request_${requestId}`, // URL dari provider
      message: 'Signing process initiated (integration pending)',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error initiating signing process:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to initiate signing process' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handler untuk menerima callback dari penyedia tanda tangan elektronik
// Endpoint ini akan diakses oleh penyedia tanda tangan setelah event tertentu (misal: dokumen dilihat, ditandatangani, ditolak, selesai)
export async function handleSignatureCallback(request: Request, env: Env): Promise<Response> {
  // This handler is specifically for receiving data *from* the e-signature provider.
  try {
    // TODO: Implementasi verifikasi callback dari provider (misal: cek signature, IP whitelist)
    // TODO: Parse payload dari provider. Format payload sangat tergantung pada penyedia.
    const eventPayload = await request.json();

    console.log('Received signature callback:', eventPayload);

    // TODO: Ambil provider_request_id dari payload
    // TODO: Cari e_signature_request yang sesuai di database berdasarkan provider_request_id
    // TODO: Update status e_signature_request dan/atau e_signature_signers berdasarkan eventPayload
    // TODO: Jika dokumen selesai ditandatangani, dapatkan salinan dokumen yang ditandatangani dari provider dan simpan di R2.
    // TODO: Panggil logika bukti tanda tangan aman untuk dokumen yang sudah ditandatangani.

    // Beri respons sukses ke provider
    return new Response('Callback received successfully', { status: 200 });

  } catch (error: any) {
    console.error('Error handling signature callback:', error);
    // Penting untuk memberikan respons yang sesuai agar provider tidak terus mencoba mengirim callback
    return new Response(JSON.stringify({ error: error.message || 'Failed to process callback' }), {
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

    // Langkah 1: Implementasi Logika Verifikasi Identitas
    // Ini adalah placeholder. Implementasi nyata akan tergantung pada metode verifikasi
    // yang digunakan (misalnya, email verification link, SMS code, integration with identity provider).
    // Untuk demonstrasi, kita akan menambahkan TODO di sini.
    // TODO: Implementasi logika verifikasi identitas penandatangan sebelum memungkinkan mereka menandatangani.
    // Ini bisa melibatkan:
    // 1. Mengirim link unik atau kode ke email/nomor telepon signer.
    // 2. Meminta signer login atau mengautentikasi melalui metode lain.
    // 3. Membandingkan data yang diberikan dengan data yang sudah ada (jika tersedia).
    console.log(`TODO: Implement identity verification for signer ${signerId} for request ${requestId}`);

    // Jika verifikasi gagal, kembalikan respons error
    // if (!isIdentityVerified) {
    //   return new Response(JSON.stringify({ error: 'Signer identity not verified' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    // } // closing brace was misplaced

    // Langkah 2: Implementasi Logika Bukti Tanda Tangan yang Aman
    // Ini melibatkan:
    // a) Mendapatkan konten dokumen yang ditandatangani (misalnya dari signed_document_key R2)
    // b) Menghasilkan hash dari konten dokumen tersebut
    // c) Menyimpan hash bersama dengan detail tanda tangan (siapa, kapan, status)
    console.log(`TODO: Implement secure proof of signature for signer ${signerId} for request ${requestId}`);

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
