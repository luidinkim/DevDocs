import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
}

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#fff',
    primaryBorderColor: '#4f46e5',
    lineColor: '#e5e7eb',
    secondaryColor: '#f3f4f6',
    tertiaryColor: '#fef3c7',
    darkMode: false
  }
})

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      mermaid.contentLoaded()
    }
  }, [chart])

  return (
    <div className="mermaid" ref={ref}>
      {chart}
    </div>
  )
}

export default Mermaid