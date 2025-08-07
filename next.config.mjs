import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  mdxBaseDirectory: 'app'
})

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
}

export default withNextra(nextConfig)