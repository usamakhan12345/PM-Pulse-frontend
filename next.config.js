/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a test build run in its own folder without touching a running dev server
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Private app pages should never appear in search results
        source: '/dashboard/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com'
      }
    ]
  }
};

module.exports = nextConfig;
