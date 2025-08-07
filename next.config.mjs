import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true
})

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko'
  }
}

export default withNextra(nextConfig)