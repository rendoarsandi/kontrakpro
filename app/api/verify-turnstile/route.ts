import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Tambahkan ini

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, message: 'Turnstile token is missing.' }, { status: 400 });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
      console.error('TURNSTILE_SECRET_KEY is not set in environment variables.');
      return NextResponse.json({ success: false, message: 'Server configuration error.' }, { status: 500 });
    }

    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    // Anda juga bisa menambahkan 'remoteip' jika diperlukan, ambil dari header request
    // formData.append('remoteip', request.headers.get('CF-Connecting-IP') || '');

    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const verificationData = await verificationResponse.json();

    if (verificationData.success) {
      // Token valid
      // Di sini Anda bisa melanjutkan dengan logika aplikasi Anda,
      // misalnya, mengizinkan login, pendaftaran, dll.
      return NextResponse.json({ success: true, message: 'Turnstile verification successful.' });
    } else {
      // Token tidak valid
      console.error('Turnstile verification failed:', verificationData['error-codes']);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Turnstile verification failed.', 
          errors: verificationData['error-codes'] 
        }, 
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in Turnstile verification route:', error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}