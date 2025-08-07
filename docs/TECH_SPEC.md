# Technical Specification Document
## DevDocs - Nextra Documentation Platform

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
├───────────────┬─────────────────┬───────────────────────────┤
│   Browser     │   Mobile Web    │      Search Engines       │
└───────┬───────┴────────┬────────┴────────────┬──────────────┘
        │                │                     │
        ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     CDN (CloudFront)                         │
│           - Static Assets - Caching - Compression            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS Amplify Hosting                       │
│         - Next.js SSG/SSR - Auto Scaling - CI/CD            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
├─────────────────┬──────────────────┬────────────────────────┤
│     Nextra      │    Next.js 14    │     React 18          │
│   Documentation │   App Router      │    Components         │
│    Framework    │   Static Gen      │    State Mgmt         │
└─────────────────┴──────────────────┴────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
├──────────────┬────────────────┬──────────────────────────────┤
│   Markdown   │   MDX Files    │     Configuration          │
│    Content   │   Components   │      JSON/YAML             │
└──────────────┴────────────────┴──────────────────────────────┘
```

### 1.2 Technology Stack Details

#### Core Framework
```json
{
  "framework": {
    "nextra": "^3.0.0",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "language": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0"
  },
  "styling": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  },
  "utilities": {
    "nextra-theme-docs": "^3.0.0",
    "shiki": "^1.0.0",
    "rehype-pretty-code": "^0.13.0",
    "remark-gfm": "^4.0.0"
  }
}
```

---

## 2. Project Structure

### 2.1 Directory Layout

```
devdocs/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions for Amplify
├── pages/
│   ├── _app.tsx                # Next.js App component
│   ├── _document.tsx            # HTML document structure
│   ├── index.mdx                # Homepage
│   ├── getting-started/
│   │   ├── _meta.json          # Section metadata
│   │   ├── introduction.mdx
│   │   └── installation.mdx
│   ├── docs/
│   │   ├── _meta.json
│   │   ├── frontend/
│   │   ├── backend/
│   │   └── best-practices/
│   ├── analytics/
│   │   ├── _meta.json
│   │   └── game-analytics/
│   │       └── comparison.mdx
│   └── api/
│       └── search.ts           # Search API endpoint
├── components/
│   ├── Layout.tsx              # Custom layout component
│   ├── Card.tsx                # Reusable card component
│   ├── CodeBlock.tsx           # Enhanced code display
│   ├── Analytics.tsx           # Analytics wrapper
│   └── Search.tsx              # Search interface
├── styles/
│   ├── globals.css             # Global styles
│   └── syntax-theme.css        # Code highlighting theme
├── public/
│   ├── favicon.ico
│   ├── images/
│   └── assets/
├── lib/
│   ├── search.ts               # Search implementation
│   ├── analytics.ts            # Analytics helpers
│   └── utils.ts                # Utility functions
├── theme.config.tsx            # Nextra theme configuration
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies
├── amplify.yml                 # AWS Amplify build config
└── README.md                   # Project documentation
```

### 2.2 Configuration Files

#### next.config.js
```javascript
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  flexsearch: {
    codeblocks: true
  },
  staticImage: true,
  latex: true
})

module.exports = withNextra({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko'
  },
  images: {
    domains: ['your-domain.com']
  },
  async redirects() {
    return [
      {
        source: '/analytics',
        destination: '/analytics/game-analytics/comparison',
        permanent: false
      }
    ]
  }
})
```

#### theme.config.tsx
```typescript
import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

const config: DocsThemeConfig = {
  logo: (
    <>
      <svg width="24" height="24" viewBox="0 0 24 24">
        {/* Logo SVG */}
      </svg>
      <span style={{ marginLeft: '.4em', fontWeight: 800 }}>
        DevDocs
      </span>
    </>
  ),
  project: {
    link: 'https://github.com/yourusername/devdocs',
  },
  chat: {
    link: 'https://discord.com/invite/yourserver',
  },
  docsRepositoryBase: 'https://github.com/yourusername/devdocs/tree/main',
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} © DevDocs. Built with Nextra.
      </span>
    ),
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="DevDocs" />
      <meta property="og:description" content="Personal Development & Educational Documentation" />
    </>
  ),
  primaryHue: 260,
  navigation: {
    prev: true,
    next: true,
  },
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
    float: true,
    headingComponent: function HeadingComponent({ id, children }) {
      return <>{children}</>
    },
  },
  editLink: {
    text: 'Edit this page on GitHub →',
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback',
  },
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – DevDocs'
      }
    }
  },
  banner: {
    key: 'beta-release',
    text: (
      <a href="/changelog" target="_blank">
        🎉 DevDocs Beta is now live. Read more →
      </a>
    ),
  },
  search: {
    placeholder: 'Search documentation...',
  },
  i18n: [
    { locale: 'ko', text: '한국어' },
    { locale: 'en', text: 'English' }
  ]
}

export default config
```

#### amplify.yml
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
  
  customHeaders:
    - pattern: '**/*'
      headers:
        - key: 'X-Frame-Options'
          value: 'SAMEORIGIN'
        - key: 'X-Content-Type-Options'
          value: 'nosniff'
        - key: 'X-XSS-Protection'
          value: '1; mode=block'
    - pattern: '**/*.@(jpg|jpeg|gif|png|svg|ico)'
      headers:
        - key: 'Cache-Control'
          value: 'public, max-age=31536000, immutable'
    - pattern: '**/*.@(js|css)'
      headers:
        - key: 'Cache-Control'
          value: 'public, max-age=31536000, immutable'
```

---

## 3. Implementation Details

### 3.1 Search Implementation

#### Full-Text Search with FlexSearch
```typescript
// lib/search.ts
import FlexSearch from 'flexsearch'

interface SearchDocument {
  id: string
  title: string
  content: string
  url: string
  category: string
}

class SearchService {
  private index: FlexSearch.Index<SearchDocument>

  constructor() {
    this.index = new FlexSearch.Index({
      tokenize: 'forward',
      resolution: 9,
      cache: 100,
      doc: {
        id: 'id',
        field: ['title', 'content', 'category']
      }
    })
  }

  async buildIndex(documents: SearchDocument[]) {
    documents.forEach(doc => {
      this.index.add(doc)
    })
  }

  search(query: string, limit = 10): SearchDocument[] {
    return this.index.search(query, { limit })
  }
}

export default SearchService
```

### 3.2 Analytics Integration

#### Google Analytics 4 Setup
```typescript
// components/Analytics.tsx
import Script from 'next/script'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

export default function Analytics() {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: url,
        })
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
```

### 3.3 MDX Components

#### Custom Components for MDX
```typescript
// components/MDXComponents.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Callout } from 'nextra/components'

const MDXComponents = {
  Image,
  Link,
  Callout,
  // Custom components
  Card: ({ title, description, href }) => (
    <Link href={href} className="card-link">
      <div className="card">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  ),
  CodeComparison: ({ before, after, language = 'javascript' }) => (
    <div className="code-comparison">
      <div className="before">
        <h4>Before</h4>
        <pre><code className={`language-${language}`}>{before}</code></pre>
      </div>
      <div className="after">
        <h4>After</h4>
        <pre><code className={`language-${language}`}>{after}</code></pre>
      </div>
    </div>
  ),
  Prerequisites: ({ items }) => (
    <div className="prerequisites">
      <h4>Prerequisites</h4>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default MDXComponents
```

---

## 4. Performance Optimization

### 4.1 Build Optimization

#### Static Generation Strategy
```javascript
// Build-time optimization
module.exports = {
  // Enable ISR for dynamic content
  revalidate: 3600, // Revalidate every hour
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  
  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module) {
              return module.size() > 160000
            },
            name(module) {
              const hash = crypto.createHash('sha1')
              hash.update(module.identifier())
              return hash.digest('hex').substring(0, 8)
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
        },
      }
    }
    return config
  },
}
```

### 4.2 Runtime Performance

#### Core Web Vitals Optimization
```typescript
// lib/performance.ts
export const reportWebVitals = (metric: any) => {
  if (metric.label === 'web-vital') {
    console.log(metric) // Log to console
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value),
        non_interaction: true,
      })
    }
  }
}

// Lazy loading implementation
export const lazyLoad = (importFunc: () => Promise<any>) => {
  return dynamic(importFunc, {
    loading: () => <div>Loading...</div>,
    ssr: false
  })
}
```

---

## 5. Security Implementation

### 5.1 Security Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CSP
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';"
  )
  
  return response
}

export const config = {
  matcher: '/:path*',
}
```

### 5.2 Rate Limiting

```typescript
// lib/rateLimiter.ts
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1])
        }
        
        tokenCount[0] += 1
        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage > limit
        
        if (isRateLimited) {
          reject(new Error('Rate limit exceeded'))
        } else {
          tokenCache.set(token, tokenCount)
          resolve()
        }
      }),
  }
}
```

---

## 6. Internationalization (i18n)

### 6.1 Multi-language Support

```typescript
// lib/i18n.ts
export const translations = {
  ko: {
    common: {
      search: '검색',
      home: '홈',
      documentation: '문서',
      about: '소개'
    },
    messages: {
      welcome: '개발 문서에 오신 것을 환영합니다',
      notFound: '페이지를 찾을 수 없습니다'
    }
  },
  en: {
    common: {
      search: 'Search',
      home: 'Home',
      documentation: 'Documentation',
      about: 'About'
    },
    messages: {
      welcome: 'Welcome to DevDocs',
      notFound: 'Page not found'
    }
  }
}

export function useTranslation(locale: string) {
  return translations[locale] || translations.en
}
```

---

## 7. Testing Strategy

### 7.1 Testing Setup

```json
// package.json testing dependencies
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "cypress": "^13.0.0"
  }
}
```

### 7.2 Test Examples

```typescript
// __tests__/components/Search.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Search from '@/components/Search'

describe('Search Component', () => {
  it('renders search input', () => {
    render(<Search />)
    const input = screen.getByPlaceholderText(/search/i)
    expect(input).toBeInTheDocument()
  })
  
  it('handles search query', () => {
    render(<Search />)
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'react' } })
    expect(input.value).toBe('react')
  })
})
```

---

## 8. CI/CD Pipeline

### 8.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS Amplify

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Amplify
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ap-northeast-2
        run: |
          aws amplify start-job \
            --app-id ${{ secrets.AMPLIFY_APP_ID }} \
            --branch-name main \
            --job-type RELEASE
```

---

## 9. Monitoring & Logging

### 9.1 Error Tracking

```typescript
// lib/errorTracking.ts
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Send to logging service
    if (process.env.NODE_ENV === 'production') {
      // Sentry, LogRocket, etc.
      logErrorToService(error, errorInfo)
    }
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

### 9.2 Performance Monitoring

```typescript
// lib/monitoring.ts
export const measurePerformance = (name: string, fn: Function) => {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start
  
  // Log performance metrics
  console.log(`${name} took ${duration}ms`)
  
  // Send to analytics
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name,
      value: Math.round(duration),
    })
  }
  
  return result
}
```

---

## 10. API Specifications

### 10.1 Search API

```typescript
// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { q, limit = 10, offset = 0 } = req.query
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter required' })
  }
  
  try {
    // Implement search logic
    const results = await searchContent(q as string, {
      limit: Number(limit),
      offset: Number(offset)
    })
    
    res.status(200).json({
      query: q,
      results,
      total: results.length,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

---

*Document Version: 1.0*  
*Last Updated: 2025-08-07*  
*Related Documents: PRD.md, INFORMATION_ARCHITECTURE.md*