/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'api.hiro.so'],
  },
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
  },
}

module.exports = nextConfig
