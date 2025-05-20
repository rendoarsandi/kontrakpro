/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Konfigurasi untuk Cloudflare Pages
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig