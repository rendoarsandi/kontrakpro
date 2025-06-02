import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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
  experimental: {
    optimizeCss: true
  },
  // Enable Node.js compatibility mode for Cloudflare Pages
  env: {
    NODEJS_COMPAT: 'true'
  }
}

export default withBundleAnalyzer(nextConfig);