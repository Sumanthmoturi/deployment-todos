/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
     
      NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production'
        ? 'https://deployment-todo-backend.onrender.com'  // Production API URL
        : 'http://localhost:3001', 
    },
  };
  
  export default nextConfig;
  