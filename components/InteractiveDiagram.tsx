import React, { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'

// Alternative solution using native SVG for better performance
interface InteractiveDiagramProps {
  type: 'flowchart' | 'architecture' | 'sequence' | 'mindmap'
  data: any
  title?: string
  className?: string
}

const InteractiveDiagram: React.FC<InteractiveDiagramProps> = ({
  type,
  data,
  title,
  className = ''
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // Generate SVG based on diagram type
  const renderDiagram = useMemo(() => {
    switch (type) {
      case 'flowchart':
        return renderFlowchart(data)
      case 'architecture':
        return renderArchitecture(data)
      case 'sequence':
        return renderSequence(data)
      case 'mindmap':
        return renderMindmap(data)
      default:
        return null
    }
  }, [type, data])

  // Flowchart renderer
  const renderFlowchart = (flowData: any) => {
    return (
      <svg
        viewBox="0 0 800 600"
        className="interactive-diagram"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
        }}
      >
        <defs>
          {/* Modern gradients */}
          <linearGradient id="nodeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="1" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="nodeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f093fb" stopOpacity="1" />
            <stop offset="100%" stopColor="#f5576c" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="nodeGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" stopOpacity="1" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="1" />
          </linearGradient>
          
          {/* Drop shadows */}
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feFlood floodColor="#000000" floodOpacity="0.1"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid background */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Example nodes and connections */}
        {flowData.nodes?.map((node: any, index: number) => (
          <g key={node.id} className="node-group">
            {/* Connection lines */}
            {node.connections?.map((conn: string) => {
              const targetNode = flowData.nodes.find((n: any) => n.id === conn)
              if (!targetNode) return null
              
              return (
                <path
                  key={`${node.id}-${conn}`}
                  d={`M ${node.x + 100} ${node.y + 30} Q ${(node.x + targetNode.x + 200) / 2} ${(node.y + targetNode.y + 60) / 2} ${targetNode.x + 100} ${targetNode.y + 30}`}
                  stroke="#cbd5e0"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={hoveredNode === node.id ? "5,5" : "0"}
                  className="connection-line"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="10"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              )
            })}
            
            {/* Node rectangle */}
            <rect
              x={node.x}
              y={node.y}
              width="200"
              height="60"
              rx="8"
              ry="8"
              fill={`url(#nodeGradient${(index % 3) + 1})`}
              filter="url(#dropShadow)"
              className={`node ${selectedNode === node.id ? 'selected' : ''} ${hoveredNode === node.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(node.id)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: hoveredNode === node.id ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            
            {/* Node text */}
            <text
              x={node.x + 100}
              y={node.y + 35}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="600"
              style={{ pointerEvents: 'none' }}
            >
              {node.label}
            </text>
            
            {/* Node icon */}
            {node.icon && (
              <text
                x={node.x + 20}
                y={node.y + 35}
                fontSize="20"
                style={{ pointerEvents: 'none' }}
              >
                {node.icon}
              </text>
            )}
          </g>
        ))}
        
        {/* Selected node info */}
        {selectedNode && (
          <g className="info-panel">
            <rect
              x="20"
              y="20"
              width="200"
              height="100"
              rx="8"
              fill="white"
              fillOpacity="0.95"
              stroke="#e2e8f0"
              strokeWidth="1"
              filter="url(#dropShadow)"
            />
            <text x="30" y="45" fontSize="12" fontWeight="600" fill="#1a202c">
              Node: {selectedNode}
            </text>
            <text x="30" y="65" fontSize="11" fill="#4a5568">
              Click to see details
            </text>
            <text x="30" y="85" fontSize="11" fill="#4a5568">
              Connections: 3
            </text>
            <text x="30" y="105" fontSize="11" fill="#4a5568">
              Status: Active
            </text>
          </g>
        )}
      </svg>
    )
  }

  // Architecture diagram renderer
  const renderArchitecture = (archData: any) => {
    // Similar structure with different styling
    return renderFlowchart(archData)
  }

  // Sequence diagram renderer
  const renderSequence = (seqData: any) => {
    return (
      <svg viewBox="0 0 800 600" className="sequence-diagram">
        {/* Implement sequence diagram specific rendering */}
        <text x="400" y="300" textAnchor="middle" fontSize="16" fill="#4a5568">
          Sequence Diagram (Coming Soon)
        </text>
      </svg>
    )
  }

  // Mindmap renderer
  const renderMindmap = (mindData: any) => {
    return (
      <svg viewBox="0 0 800 600" className="mindmap-diagram">
        {/* Implement mindmap specific rendering */}
        <text x="400" y="300" textAnchor="middle" fontSize="16" fill="#4a5568">
          Mindmap (Coming Soon)
        </text>
      </svg>
    )
  }

  return (
    <div className={`interactive-diagram-container ${className}`}>
      {title && <h3 className="diagram-title">{title}</h3>}
      
      {/* Controls */}
      <div className="diagram-controls">
        <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))}>+</button>
        <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}>-</button>
        <button onClick={() => setZoom(1)}>Reset</button>
        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
      </div>
      
      {/* Diagram */}
      <div className="diagram-viewport">
        {renderDiagram}
      </div>
      
      <style jsx>{`
        .interactive-diagram-container {
          position: relative;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .diagram-title {
          padding: 1rem 1.5rem;
          margin: 0;
          border-bottom: 1px solid #e2e8f0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .diagram-controls {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          display: flex;
          gap: 0.5rem;
          background: white;
          padding: 0.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .diagram-controls button {
          width: 32px;
          height: 32px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .diagram-controls button:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }
        
        .zoom-level {
          display: flex;
          align-items: center;
          padding: 0 0.5rem;
          font-size: 0.875rem;
          color: #4a5568;
        }
        
        .diagram-viewport {
          position: relative;
          width: 100%;
          height: 600px;
          overflow: hidden;
        }
        
        .diagram-viewport :global(svg) {
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease;
        }
        
        :global(.dark) .interactive-diagram-container {
          background: #1e1e2e;
        }
        
        :global(.dark) .diagram-title {
          color: #cdd6f4;
          border-bottom-color: #45475a;
        }
        
        :global(.dark) .diagram-controls {
          background: #2a2a3e;
        }
        
        :global(.dark) .diagram-controls button {
          background: #2a2a3e;
          border-color: #45475a;
          color: #cdd6f4;
        }
        
        :global(.dark) .diagram-controls button:hover {
          background: #45475a;
        }
      `}</style>
    </div>
  )
}

export default InteractiveDiagram