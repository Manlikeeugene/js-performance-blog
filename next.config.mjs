
// import path from 'path'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//         port: '',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//         port: '',
//         pathname: '/**', // Allow all paths under Cloudinary
//       },
//     ],
//   },
//   turbopack: {
//     root: path.join(__dirname, '.'),  // Absolute path to project root (adjust if needed for monorepo)
//   },
//   // Add this if you still see the workspace root warning after the above
//   // outputFileTracingRoot: path.join(__dirname, '.'),
// }

// export default nextConfig

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Allow all paths under Cloudinary
      },
    ],
  },
  // turbopack: {  // Disabled for production deploys to avoid build instability
  //   root: path.join(__dirname, '.'),
  // },
  // Uncomment below if workspace root warning persists (helps with multiple lockfiles)
  // outputFileTracingRoot: path.join(__dirname, '.'),
}

export default nextConfig