/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects() {
    return [
      process.env.MAINTENANCE_MODE === '1'
        ? {
            source: '/((?!maintenance).*)',
            destination: '/maintenance.html',
            permanent: false
          }
        : null
    ].filter(Boolean);
  }
};

module.exports = withBundleAnalyzer(nextConfig);
