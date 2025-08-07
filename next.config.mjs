import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true
})

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

export default withNextra(nextConfig)