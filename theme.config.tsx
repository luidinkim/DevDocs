import React from 'react'

const config = {
  logo: <span>DevDocs</span>,
  project: {
    link: 'https://github.com/yourusername/devdocs',
  },
  docsRepositoryBase: 'https://github.com/yourusername/devdocs',
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