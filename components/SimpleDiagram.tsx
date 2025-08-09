'use client'

import React, { useState } from 'react'

interface SimpleDiagramProps {
  code: string
  title?: string
  description?: string
}

const SimpleDiagram: React.FC<SimpleDiagramProps> = ({ code, title, description }) => {
  const [scale, setScale] = useState(1)

  const parseCode = (d2Code: string) => {
    const lines = d2Code.trim().split('\n')
    const nodes = new Map<string, { label: string; x: number; y: number }>()
    const edges: Array<{ from: string; to: string; label?: string }> = []
    
    let nodeIndex = 0
    
    lines.forEach(line => {
      const trimmed = line.trim()
      if (!trimmed) return
      
      const edgeMatch = trimmed.match(/^(\S+)\s*->\s*(\S+)(?:\s*:\s*(.+))?/)
      if (edgeMatch) {
        const [, from, to, label] = edgeMatch
        
        if (!nodes.has(from)) {
          nodes.set(from, {
            label: from,
            x: 100 + (nodeIndex % 3) * 200,
            y: 100 + Math.floor(nodeIndex / 3) * 120
          })
          nodeIndex++
        }
        
        if (!nodes.has(to)) {
          nodes.set(to, {
            label: to,
            x: 100 + (nodeIndex % 3) * 200,
            y: 100 + Math.floor(nodeIndex / 3) * 120
          })
          nodeIndex++
        }
        
        edges.push({ from, to, label: label?.trim() })
      }
    })
    
    return { nodes, edges }
  }

  const { nodes, edges } = parseCode(code)

  const containerStyle: React.CSSProperties = {
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '4px',
    margin: '16px 0'
  }

  const wrapperStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column'
  }

  const headerStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#2d3748',
    margin: '0 0 4px 0'
  }

  const descStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#718096',
    margin: 0
  }

  const controlsStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    background: '#f8fafc'
  }

  const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    background: 'white',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#4a5568'
  }

  const canvasStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
    background: '#fafbfc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  }

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {(title || description) && (
          <div style={headerStyle}>
            {title && <h3 style={titleStyle}>📊 {title}</h3>}
            {description && <p style={descStyle}>{description}</p>}
          </div>
        )}
        
        <div style={controlsStyle}>
          <button style={buttonStyle} onClick={() => setScale(s => Math.min(2, s + 0.2))}>
            🔍 확대
          </button>
          <button style={buttonStyle} onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>
            🔍 축소
          </button>
          <button style={buttonStyle} onClick={() => setScale(1)}>
            ↺ 초기화
          </button>
          <div style={{ marginLeft: 'auto', padding: '6px 12px', background: '#edf2f7', borderRadius: '6px', fontSize: '14px', color: '#4a5568' }}>
            {Math.round(scale * 100)}%
          </div>
        </div>
        
        <div style={canvasStyle}>
          <div style={{ transform: `scale(${scale})`, transition: 'transform 0.3s' }}>
            <svg width="600" height="400" viewBox="0 0 600 400">
              <defs>
                <marker
                  id="arrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#4a5568" />
                </marker>
              </defs>
              
              {edges.map((edge, i) => {
                const fromNode = nodes.get(edge.from)
                const toNode = nodes.get(edge.to)
                if (!fromNode || !toNode) return null
                
                return (
                  <g key={i}>
                    <line
                      x1={fromNode.x + 40}
                      y1={fromNode.y}
                      x2={toNode.x - 40}
                      y2={toNode.y}
                      stroke="#4a5568"
                      strokeWidth="2"
                      markerEnd="url(#arrow)"
                    />
                    {edge.label && (
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 5}
                        textAnchor="middle"
                        fill="#4a5568"
                        fontSize="12"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                )
              })}
              
              {Array.from(nodes.entries()).map(([id, node]) => (
                <g key={id}>
                  <rect
                    x={node.x - 40}
                    y={node.y - 20}
                    width="80"
                    height="40"
                    fill="#667eea"
                    stroke="#5a67d8"
                    strokeWidth="2"
                    rx="8"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="600"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleDiagram