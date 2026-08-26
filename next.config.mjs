/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placekitten.com" },
      { protocol: "https", hostname: "placedog.net" },
      { protocol: "https", hostname: "static.posters.cz" },
    ],
    unoptimized: true,
  },
  reactStrictMode: false,
  output: "standalone",
  experimental: {},
};

export default nextConfig;
