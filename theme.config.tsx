import React from 'react'
import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'

const config = {
  logo: <span>DevDocs</span>,
  head: () => {
    const { asPath } = useRouter()
    const { frontMatter, title } = useConfig()
    
    const pageTitle = asPath === '/' 
      ? 'DevDocs' 
      : `${title || frontMatter?.title || 'DevDocs'} – DevDocs`
    
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={frontMatter?.description || "DevDocs - 게임 개발 문서"} />
        <link rel="icon" href="/favicon.ico" />
      </>
    )
  },
  project: {
    link: 'https://github.com/luidinkim/devdocs',
  },
  docsRepositoryBase: 'https://github.com/luidinkim/devdocs',
  footer: {
    text: 'DevDocs © 2025',
  },
  primaryHue: 260,
  navigation: {
    prev: true,
    next: true,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
    autoCollapse: true,
  },
  toc: {
    backToTop: true,
    float: true,
  },
  editLink: {
    text: 'Edit this page on GitHub →',
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback',
  },
  search: {
    placeholder: '문서 검색...',
  },
  i18n: [
    { locale: 'ko', text: '한국어' },
    { locale: 'en', text: 'English' }
  ],
  darkMode: true,
  themeSwitch: {
    dark: '다크 모드',
    light: '라이트 모드',
    system: '시스템 설정'
  }
}

export default config