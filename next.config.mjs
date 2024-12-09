/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 80,
  },

  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production'
      ? 'http://ec2-13-201-101-208.ap-south-1.compute.amazonaws.com'
      : 'http://localhost:3001', 
  },
  
};

export default nextConfig;
