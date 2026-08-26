/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placekitten.com" },
      { protocol: "https", hostname: "placedog.net" },
    ],
    unoptimized: true,
  },
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Fix Windows case-sensitivity issue with D:\\Bot2 vs D:\\bot2
    if (config.resolve && config.resolve.alias) {
      // Normalize aliases to avoid duplicate module entries
      const alias = config.resolve.alias;
      for (const key of Object.keys(alias)) {
        if (typeof alias[key] === 'string') {
          alias[key] = alias[key].replace(/Bot2/gi, 'bot2');
        }
      }
    }
    return config;
  },
};

export default nextConfig;
