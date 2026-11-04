/** @type {import('next').NextConfig} */
const nextConfig = {
  // The browser needs these two addresses. Next.js only exposes variables that start with
  // NEXT_PUBLIC_ on their own, so they are listed here to make them available under their plain names.
  env: {
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL
  },
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
