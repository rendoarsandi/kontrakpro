/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Konfigurasi untuk production di Cloudflare Pages
  images: {
    domains: ['placeholder.com'], // Sesuaikan dengan domain gambar yang digunakan
    unoptimized: true, // Untuk Cloudflare Pages
  },
  trailingSlash: true,
  // Mengoptimalkan untuk Cloudflare Pages
  swcMinify: true,
  experimental: {
    optimizeCss: true
  }
}

export default nextConfig