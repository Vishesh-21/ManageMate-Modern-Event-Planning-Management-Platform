/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: ["res.cloudinary.com", "images.unsplash.com"],
  },
};

export default nextConfig;
