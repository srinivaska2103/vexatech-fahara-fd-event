/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent filesystem caching which causes ArrayBuffer allocation failures on high cache size
      config.cache = false;
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/event/dashboard',
        permanent: false,
      },
      {
        source: '/owner/dashboard',
        destination: '/event/dashboard',
        permanent: true,
      },
      {
        source: '/owner',
        destination: '/event/dashboard',
        permanent: true,
      },
      {
        source: '/owner/:path*',
        destination: '/event/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

