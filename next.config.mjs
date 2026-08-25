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
    ];
  },
};

export default nextConfig;

