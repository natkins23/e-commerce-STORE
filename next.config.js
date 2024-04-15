/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', // Leave empty unless your images are served on a specific port
        pathname: '/**', // Allows images from all paths under the domain
      },
    ],
  },
}

module.exports = nextConfig
