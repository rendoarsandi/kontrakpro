/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Konfigurasi untuk production
  images: {
    domains: ['placeholder.com'], // Sesuaikan dengan domain gambar yang digunakan
  },
  trailingSlash: true,
}

export default nextConfig