//next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'fxgkihizkwtnwvdposvw.supabase.co',
          pathname: '/storage/v1/object/public/terrain-images/**',
        },
      ],
    },
  }
  
  export default nextConfig;
