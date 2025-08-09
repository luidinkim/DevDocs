'use client'

import React, { useState } from 'react'

interface D2DiagramProps {
  code: string
  title?: string
  description?: string
}

const D2Diagram: React.FC<D2DiagramProps> = ({ code, title, description }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scale, setScale] = useState(1)

  // D2 코드를 간단한 SVG로 변환하는 함수
  const parseD2ToSVG = (d2Code: string) => {
    const lines = d2Code.trim().split('\n')
    const nodes = new Map<string, { label: string; x: number; y: number; shape?: string; color?: string }>()
    const edges: Array<{ from: string; to: string; label?: string }> = []
    
    let nodeIndex = 0
    
    lines.forEach(line => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      
      // 간단한 엣지 파싱: A -> B: label
      const edgeMatch = trimmed.match(/^(\w+)\s*->\s*(\w+)(?:\s*:\s*(.+))?/)
      if (edgeMatch) {
        const [, from, to, label] = edgeMatch
        
        if (!nodes.has(from)) {
          nodes.set(from, {
            label: from,
            x: 100 + (nodeIndex % 3) * 200,
            y: 100 + Math.floor(nodeIndex / 3) * 150
          })
          nodeIndex++
        }
        
        if (!nodes.has(to)) {
          nodes.set(to, {
            label: to,
            x: 100 + (nodeIndex % 3) * 200,
            y: 100 + Math.floor(nodeIndex / 3) * 150
          })
          nodeIndex++
        }
        
        edges.push({ from, to, label: label?.trim() })
      }
      
      // 노드 스타일 파싱: node: { ... }
      const nodeMatch = trimmed.match(/^(\w+)\s*:\s*\{/)
      if (nodeMatch) {
        const nodeName = nodeMatch[1]
        if (!nodes.has(nodeName)) {
          nodes.set(nodeName, {
            label: nodeName,
            x: 100 + (nodeIndex % 3) * 200,
            y: 100 + Math.floor(nodeIndex / 3) * 150
          })
          nodeIndex++
        }
      }
    })
    
    return { nodes, edges }
  }

  const { nodes, edges } = parseD2ToSVG(code)

  const handleZoomIn = () => setScale(s => Math.min(2, s + 0.2))
  const handleZoomOut = () => setScale(s => Math.max(0.5, s - 0.2))
  const handleReset = () => setScale(1)

  return (
    <>
      <style>{`
        .d2-diagram-container {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 4px;
          margin: 16px 0;
        }
        
        .d2-diagram-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          margin: 0;
          border-radius: 0;
        }
        
        .diagram-wrapper {
          background: white;
          border-radius: 8px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .diagram-header {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        
        .diagram-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 4px 0;
        }
        
        .diagram-description {
          font-size: 14px;
          color: #718096;
          margin: 0;
        }
        
        .diagram-controls {
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          gap: 8px;
          align-items: center;
          background: #f8fafc;
        }
        
        .control-button {
          padding: 6px 12px;
          background: white;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #4a5568;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .control-button:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }
        
        .zoom-indicator {
          margin-left: auto;
          padding: 6px 12px;
          background: #edf2f7;
          border-radius: 6px;
          font-size: 14px;
          color: #4a5568;
          font-weight: 500;
        }
        
        .diagram-canvas {
          flex: 1;
          overflow: auto;
          padding: 20px;
          background: #fafbfc;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .svg-container {
          transition: transform 0.3s ease;
        }
        
        .node-rect {
          fill: #667eea;
          stroke: #5a67d8;
          stroke-width: 2;
          rx: 8;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .node-rect:hover {
          fill: #5a67d8;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
        }
        
        .node-text {
          fill: white;
          font-size: 14px;
          font-weight: 600;
          pointer-events: none;
        }
        
        .edge-line {
          stroke: #4a5568;
          stroke-width: 2;
          fill: none;
        }
        
        .edge-label {
          fill: #4a5568;
          font-size: 12px;
          font-weight: 500;
        }
        
        .arrow-marker {
          fill: #4a5568;
        }
      `}</style>
      
      <div className={`d2-diagram-container ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="diagram-wrapper">
        {(title || description) && (
          <div className="diagram-header">
            {title && <h3 className="diagram-title">📊 {title}</h3>}
            {description && <p className="diagram-description">{description}</p>}
          </div>
        )}
        
        <div className="diagram-controls">
          <button className="control-button" onClick={handleZoomIn}>
            <span>🔍</span> 확대
          </button>
          <button className="control-button" onClick={handleZoomOut}>
            <span>🔍</span> 축소
          </button>
          <button className="control-button" onClick={handleReset}>
            <span>↺</span> 초기화
          </button>
          <button 
            className="control-button" 
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <span>{isFullscreen ? '↙' : '↗'}</span> 
            {isFullscreen ? '나가기' : '전체화면'}
          </button>
          <div className="zoom-indicator">{Math.round(scale * 100)}%</div>
        </div>
        
        <div className="diagram-canvas">
          <div 
            className="svg-container"
            style={{ transform: `scale(${scale})` }}
          >
            <svg width="600" height="400" viewBox="0 0 600 400">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    className="arrow-marker"
                  />
                </marker>
              </defs>
              
              {/* 엣지 렌더링 */}
              {edges.map((edge, i) => {
                const fromNode = nodes.get(edge.from)
                const toNode = nodes.get(edge.to)
                if (!fromNode || !toNode) return null
                
                return (
                  <g key={i}>
                    <line
                      className="edge-line"
                      x1={fromNode.x + 50}
                      y1={fromNode.y}
                      x2={toNode.x - 50}
                      y2={toNode.y}
                      markerEnd="url(#arrowhead)"
                    />
                    {edge.label && (
                      <text
                        className="edge-label"
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 5}
                        textAnchor="middle"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                )
              })}
              
              {/* 노드 렌더링 */}
              {Array.from(nodes.entries()).map(([id, node]) => (
                <g key={id}>
                  <rect
                    className="node-rect"
                    x={node.x - 50}
                    y={node.y - 20}
                    width="100"
                    height="40"
                  />
                  <text
                    className="node-text"
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
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
    </>
  )
}

export default D2Diagram