import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'DevDocs - 개발 문서 플랫폼',
  description: '개인 개발 자료와 학생들을 위한 교육 자료를 체계적으로 관리하고 공유하는 문서 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}