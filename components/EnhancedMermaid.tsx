import React, { useEffect, useRef, useState, useCallback } from 'react'
import mermaid from 'mermaid'

interface EnhancedMermaidProps {
  chart: string
  title?: string
  description?: string
  className?: string
  enableZoom?: boolean
  enableExport?: boolean
  theme?: 'default' | 'dark' | 'forest' | 'neutral' | 'modern'
}

// Modern theme configuration
const modernTheme = {
  theme: 'default' as const,
  themeVariables: {
    // Primary colors - Gradient effect
    primaryColor: '#667eea',
    primaryTextColor: '#fff',
    primaryBorderColor: '#5a67d8',
    
    // Secondary colors
    secondaryColor: '#48bb78',
    secondaryTextColor: '#fff',
    secondaryBorderColor: '#38a169',
    
    // Tertiary colors
    tertiaryColor: '#ed8936',
    tertiaryTextColor: '#fff',
    tertiaryBorderColor: '#dd6b20',
    
    // Background colors
    background: '#ffffff',
    mainBkg: '#f7fafc',
    secondBkg: '#edf2f7',
    
    // Line and border styling
    lineColor: '#cbd5e0',
    border1: '#e2e8f0',
    border2: '#a0aec0',
    
    // Font settings
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '14px',
    
    // Node styling
    nodeBkg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    nodeTextColor: '#ffffff',
    
    // Edge styling
    edgeLabelBackground: '#ffffff',
    
    // Cluster/Subgraph colors
    clusterBkg: '#f7fafc',
    clusterBorder: '#e2e8f0',
    
    // Special elements
    noteBkgColor: '#fff5f5',
    noteTextColor: '#742a2a',
    noteBorderColor: '#feb2b2',
    
    // Sequence diagram specific
    actorBkg: '#667eea',
    actorTextColor: '#ffffff',
    actorLineColor: '#5a67d8',
    
    // Git graph colors
    git0: '#667eea',
    git1: '#48bb78',
    git2: '#ed8936',
    git3: '#38b2ac',
    git4: '#f687b3',
    git5: '#9f7aea',
    git6: '#f6ad55',
    git7: '#4299e1',
    
    // State diagram
    labelColor: '#1a202c',
    errorBkgColor: '#fed7d7',
    errorTextColor: '#742a2a'
  }
}

const darkTheme = {
  theme: 'dark' as const,
  themeVariables: {
    primaryColor: '#818cf8',
    primaryTextColor: '#1e1e2e',
    primaryBorderColor: '#6366f1',
    
    secondaryColor: '#34d399',
    secondaryTextColor: '#1e1e2e',
    secondaryBorderColor: '#10b981',
    
    tertiaryColor: '#fbbf24',
    tertiaryTextColor: '#1e1e2e',
    tertiaryBorderColor: '#f59e0b',
    
    background: '#1e1e2e',
    mainBkg: '#1e1e2e',
    secondBkg: '#2a2a3e',
    
    lineColor: '#45475a',
    border1: '#45475a',
    border2: '#6c7086',
    
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '14px',
    
    nodeBkg: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
    nodeTextColor: '#1e1e2e',
    
    edgeLabelBackground: '#2a2a3e',
    edgeLabelColor: '#cdd6f4',
    
    clusterBkg: '#2a2a3e',
    clusterBorder: '#45475a',
    
    noteBkgColor: '#313244',
    noteTextColor: '#f5c2e7',
    noteBorderColor: '#f38ba8',
    
    actorBkg: '#818cf8',
    actorTextColor: '#1e1e2e',
    actorLineColor: '#6366f1',
    
    git0: '#818cf8',
    git1: '#34d399',
    git2: '#fbbf24',
    git3: '#06b6d4',
    git4: '#f472b6',
    git5: '#a78bfa',
    git6: '#fb923c',
    git7: '#60a5fa'
  }
}

const EnhancedMermaid: React.FC<EnhancedMermaidProps> = ({
  chart,
  title,
  description,
  className = '',
  enableZoom = true,
  enableExport = true,
  theme = 'modern'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scale, setScale] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)
  
  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const htmlElement = document.documentElement
      setIsDark(htmlElement.classList.contains('dark'))
    }
    
    checkDarkMode()
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  // Initialize mermaid with the selected theme
  useEffect(() => {
    const themeConfig = isDark ? darkTheme : modernTheme
    
    mermaid.initialize({
      startOnLoad: false,
      theme: themeConfig.theme,
      themeVariables: themeConfig.themeVariables,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        padding: 20
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 30,
        actorMargin: 100,
        width: 200,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35
      },
      gantt: {
        numberSectionStyles: 4,
        axisFormat: '%m/%d',
        fontSize: 14
      }
    })
  }, [isDark, theme])

  // Render the diagram
  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const element = containerRef.current.querySelector('.mermaid-content')
        
        if (element) {
          element.innerHTML = chart
          element.removeAttribute('data-processed')
          await mermaid.run({
            querySelector: '.mermaid-content'
          })
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError('Failed to render diagram. Please check the syntax.')
        setIsLoading(false)
      }
    }
    
    renderDiagram()
  }, [chart, isDark])

  // Zoom functionality
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, 2))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, 0.5))
  }, [])

  const handleZoomReset = useCallback(() => {
    setScale(1)
  }, [])

  // Export functionality
  const handleExport = useCallback((format: 'svg' | 'png') => {
    const svgElement = containerRef.current?.querySelector('svg')
    if (!svgElement) return

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const blob = new Blob([svgData], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `diagram-${Date.now()}.svg`
      link.click()
      URL.revokeObjectURL(url)
    } else if (format === 'png') {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `diagram-${Date.now()}.png`
            link.click()
            URL.revokeObjectURL(url)
          }
        })
      }
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }, [])

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`enhanced-mermaid-container ${className} ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {/* Header */}
      {(title || description) && (
        <div className="diagram-header">
          {title && <h3 className="diagram-title">{title}</h3>}
          {description && <p className="diagram-description">{description}</p>}
        </div>
      )}

      {/* Toolbar */}
      <div className="diagram-toolbar">
        <div className="toolbar-group">
          {enableZoom && (
            <>
              <button onClick={handleZoomIn} className="toolbar-btn" title="Zoom In">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M8 6a.5.5 0 01.5.5V7.5H9.5a.5.5 0 010 1H8.5V9.5a.5.5 0 01-1 0V8.5H6.5a.5.5 0 010-1H7.5V6.5A.5.5 0 018 6z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={handleZoomOut} className="toolbar-btn" title="Zoom Out">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M6.5 8a.5.5 0 000 1h3a.5.5 0 000-1h-3z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={handleZoomReset} className="toolbar-btn" title="Reset Zoom">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="zoom-indicator">{Math.round(scale * 100)}%</span>
            </>
          )}
        </div>
        
        <div className="toolbar-group">
          {enableExport && (
            <>
              <button onClick={() => handleExport('svg')} className="toolbar-btn" title="Export as SVG">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={() => handleExport('png')} className="toolbar-btn" title="Export as PNG">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
          
          <button onClick={toggleFullscreen} className="toolbar-btn" title="Fullscreen">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 7V2h5m11 5V2h-5m-5 16v-5H2m16 0v5h-5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Diagram Content */}
      <div className="diagram-wrapper" style={{ transform: `scale(${scale})` }}>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
            <p>Rendering diagram...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}
        
        <div className="mermaid-content" />
      </div>

      <style jsx>{`
        .enhanced-mermaid-container {
          position: relative;
          background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .enhanced-mermaid-container:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        :global(.dark) .enhanced-mermaid-container {
          background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
          border-color: #45475a;
        }

        .diagram-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        :global(.dark) .diagram-header {
          border-bottom-color: #45475a;
          background: rgba(30, 30, 46, 0.8);
        }

        .diagram-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
        }

        :global(.dark) .diagram-title {
          color: #cdd6f4;
        }

        .diagram-description {
          margin: 0.5rem 0 0;
          color: #4a5568;
          font-size: 0.875rem;
        }

        :global(.dark) .diagram-description {
          color: #a0aec0;
        }

        .diagram-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2e8f0;
        }

        :global(.dark) .diagram-toolbar {
          background: rgba(30, 30, 46, 0.9);
          border-bottom-color: #45475a;
        }

        .toolbar-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          color: #4a5568;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toolbar-btn:hover {
          background: #edf2f7;
          color: #1a202c;
        }

        :global(.dark) .toolbar-btn {
          color: #a0aec0;
        }

        :global(.dark) .toolbar-btn:hover {
          background: #45475a;
          color: #cdd6f4;
        }

        .zoom-indicator {
          padding: 0.25rem 0.75rem;
          background: #edf2f7;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #4a5568;
        }

        :global(.dark) .zoom-indicator {
          background: #45475a;
          color: #cdd6f4;
        }

        .diagram-wrapper {
          padding: 2rem;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center;
          transition: transform 0.3s ease;
        }

        .mermaid-content {
          max-width: 100%;
          overflow: auto;
        }

        .loading-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 1rem;
          border: 3px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: #fed7d7;
          color: #742a2a;
          border-radius: 8px;
        }

        :global(.dark) .error-message {
          background: #4a1f1f;
          color: #feb2b2;
        }

        .fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          border-radius: 0;
        }

        /* Animation for smooth transitions */
        .mermaid-content :global(svg) {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .diagram-toolbar {
            flex-direction: column;
            gap: 0.75rem;
          }

          .toolbar-group {
            width: 100%;
            justify-content: center;
          }

          .diagram-wrapper {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default EnhancedMermaid