// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", // <- add this
      },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    ignoreBuildErrors: true, // temp: builds pass even with TS errors
  },
  experimental: {
    esmExternals: "loose",
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
}

export default nextConfig
