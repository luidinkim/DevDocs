'use client'

import React, { useState } from 'react'

interface ArchitectureDiagramProps {
  title?: string
  description?: string
}

const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ title, description }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [scale, setScale] = useState(1)

  const nodeStyle = (isHovered: boolean) => ({
    fill: isHovered ? '#5a67d8' : '#667eea',
    stroke: '#4c51bf',
    strokeWidth: 2,
    cursor: 'pointer',
    transition: 'all 0.3s'
  })

  const textStyle = {
    fill: 'white',
    fontSize: '12px',
    fontWeight: 600,
    pointerEvents: 'none' as const
  }

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
    borderRadius: '8px'
  }

  const headerStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc'
  }

  const controlsStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    gap: '8px',
    background: '#f8fafc'
  }

  const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    background: 'white',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  }

  const canvasStyle: React.CSSProperties = {
    padding: '20px',
    background: '#fafbfc',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '500px'
  }

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {(title || description) && (
          <div style={headerStyle}>
            {title && <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2d3748', margin: '0 0 4px 0' }}>
              📊 {title}
            </h3>}
            {description && <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
              {description}
            </p>}
          </div>
        )}
        
        <div style={controlsStyle}>
          <button style={buttonStyle} onClick={() => setScale(s => Math.min(1.5, s + 0.1))}>
            🔍 확대
          </button>
          <button style={buttonStyle} onClick={() => setScale(s => Math.max(0.7, s - 0.1))}>
            🔍 축소
          </button>
          <button style={buttonStyle} onClick={() => setScale(1)}>
            ↺ 초기화
          </button>
          <div style={{ marginLeft: 'auto', padding: '6px 12px', background: '#edf2f7', borderRadius: '6px', fontSize: '14px' }}>
            {Math.round(scale * 100)}%
          </div>
        </div>
        
        <div style={canvasStyle}>
          <svg 
            width={700 * scale} 
            height={500 * scale} 
            viewBox="0 0 700 500"
            style={{ transition: 'all 0.3s' }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#4a5568" />
              </marker>
            </defs>

            {/* 사용자 인터페이스 그룹 */}
            <g>
              <rect x="50" y="50" width="120" height="120" fill="#f7fafc" stroke="#cbd5e0" strokeWidth="2" rx="8" />
              <text x="110" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2d3748">
                사용자 인터페이스
              </text>
              
              <rect 
                x="60" y="70" width="100" height="30" 
                {...nodeStyle(hoveredNode === 'user-input')}
                rx="4"
                onMouseEnter={() => setHoveredNode('user-input')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="110" y="90" textAnchor="middle" {...textStyle}>사용자 입력</text>
              
              <rect 
                x="60" y="110" width="45" height="30" 
                {...nodeStyle(hoveredNode === 'sc-cmd')}
                rx="4"
                onMouseEnter={() => setHoveredNode('sc-cmd')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="82" y="130" textAnchor="middle" {...textStyle}>sc:</text>
              
              <rect 
                x="115" y="110" width="45" height="30" 
                {...nodeStyle(hoveredNode === 'normal-cmd')}
                rx="4"
                onMouseEnter={() => setHoveredNode('normal-cmd')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="137" y="130" textAnchor="middle" {...textStyle}>일반</text>
            </g>

            {/* 오케스트레이터 그룹 */}
            <g>
              <rect x="250" y="50" width="150" height="120" fill="#f7fafc" stroke="#cbd5e0" strokeWidth="2" rx="8" />
              <text x="325" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2d3748">
                오케스트레이터
              </text>
              
              <rect 
                x="260" y="70" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'parser')}
                rx="4"
                onMouseEnter={() => setHoveredNode('parser')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="325" y="88" textAnchor="middle" {...textStyle}>명령어 파서</text>
              
              <rect 
                x="260" y="100" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'context')}
                rx="4"
                onMouseEnter={() => setHoveredNode('context')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="325" y="118" textAnchor="middle" {...textStyle}>컨텍스트 분석</text>
              
              <rect 
                x="260" y="130" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'complexity')}
                rx="4"
                onMouseEnter={() => setHoveredNode('complexity')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="325" y="148" textAnchor="middle" {...textStyle}>복잡도 평가</text>
            </g>

            {/* 페르소나 그룹 */}
            <g>
              <rect x="480" y="50" width="150" height="120" fill="#f7fafc" stroke="#cbd5e0" strokeWidth="2" rx="8" />
              <text x="555" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2d3748">
                페르소나 (11개)
              </text>
              
              <rect 
                x="490" y="70" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'frontend')}
                rx="4"
                onMouseEnter={() => setHoveredNode('frontend')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="555" y="88" textAnchor="middle" {...textStyle}>Frontend/Backend</text>
              
              <rect 
                x="490" y="100" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'security')}
                rx="4"
                onMouseEnter={() => setHoveredNode('security')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="555" y="118" textAnchor="middle" {...textStyle}>Security/Performance</text>
              
              <rect 
                x="490" y="130" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'qa')}
                rx="4"
                onMouseEnter={() => setHoveredNode('qa')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="555" y="148" textAnchor="middle" {...textStyle}>QA/DevOps</text>
            </g>

            {/* MCP 서버 그룹 */}
            <g>
              <rect x="250" y="220" width="150" height="120" fill="#f7fafc" stroke="#cbd5e0" strokeWidth="2" rx="8" />
              <text x="325" y="200" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2d3748">
                MCP 서버
              </text>
              
              <rect 
                x="260" y="240" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'sequential')}
                rx="4"
                onMouseEnter={() => setHoveredNode('sequential')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="325" y="258" textAnchor="middle" {...textStyle}>Sequential</text>
              
              <rect 
                x="260" y="270" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'context7')}
                rx="4"
                onMouseEnter={() => setHoveredNode('context7')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="325" y="288" textAnchor="middle" {...textStyle}>Context7</text>
              
              <rect 
                x="260" y="300" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'magic')}
                rx="4"
                onMouseEnter={() => setHoveredNode('magic')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="325" y="318" textAnchor="middle" {...textStyle}>Magic/Playwright</text>
            </g>

            {/* 실행 엔진 그룹 */}
            <g>
              <rect x="480" y="220" width="150" height="120" fill="#f7fafc" stroke="#cbd5e0" strokeWidth="2" rx="8" />
              <text x="555" y="200" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2d3748">
                실행 엔진
              </text>
              
              <rect 
                x="490" y="240" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'codegen')}
                rx="4"
                onMouseEnter={() => setHoveredNode('codegen')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="555" y="258" textAnchor="middle" {...textStyle}>코드 생성</text>
              
              <rect 
                x="490" y="270" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'test')}
                rx="4"
                onMouseEnter={() => setHoveredNode('test')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="555" y="288" textAnchor="middle" {...textStyle}>테스트</text>
              
              <rect 
                x="490" y="300" width="130" height="25" 
                {...nodeStyle(hoveredNode === 'docs')}
                rx="4"
                onMouseEnter={() => setHoveredNode('docs')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="555" y="318" textAnchor="middle" {...textStyle}>문서화</text>
            </g>

            {/* 출력 */}
            <g>
              <rect 
                x="340" y="390" width="120" height="40" 
                {...nodeStyle(hoveredNode === 'output')}
                rx="6"
                onMouseEnter={() => setHoveredNode('output')}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text x="400" y="415" textAnchor="middle" {...textStyle} fontSize="14">결과 출력</text>
            </g>

            {/* 연결선 */}
            <line x1="170" y1="110" x2="250" y2="110" stroke="#4a5568" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="400" y1="110" x2="480" y2="110" stroke="#4a5568" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="325" y1="170" x2="325" y2="220" stroke="#4a5568" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="555" y1="170" x2="555" y2="220" stroke="#4a5568" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="400" y1="280" x2="480" y2="280" stroke="#4a5568" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="555" y1="340" x2="400" y2="390" stroke="#4a5568" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="325" y1="340" x2="400" y2="390" stroke="#4a5568" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default ArchitectureDiagram