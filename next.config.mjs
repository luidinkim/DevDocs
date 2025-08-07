import { createNextraConfig } from 'nextra'

const withNextra = createNextraConfig({
  defaultShowCopyCode: true
})

export default withNextra({
  reactStrictMode: true,
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko'
  }
})