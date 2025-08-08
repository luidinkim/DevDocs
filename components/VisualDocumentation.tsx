import React, { useState } from 'react'
import { Tabs } from 'nextra/components'

interface CardData {
  id: string
  title: string
  icon: string
  description: string
  details?: string[]
  connections?: string[]
  color: string
}

interface SectionData {
  title: string
  cards: CardData[]
}

// 카드 기반 시각화 컴포넌트
export const CardGrid: React.FC<{ data: SectionData }> = ({ data }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  return (
    <div className="card-grid-container">
      <h3 className="section-title">{data.title}</h3>
      <div className="card-grid">
        {data.cards.map((card) => (
          <div
            key={card.id}
            className={`visual-card ${selectedCard === card.id ? 'selected' : ''}`}
            onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
            style={{ borderColor: card.color }}
          >
            <div className="card-header">
              <span className="card-icon">{card.icon}</span>
              <h4 className="card-title">{card.title}</h4>
            </div>
            <p className="card-description">{card.description}</p>
            
            {selectedCard === card.id && card.details && (
              <div className="card-details">
                <ul>
                  {card.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
                {card.connections && (
                  <div className="connections">
                    <strong>연결:</strong> {card.connections.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .card-grid-container {
          margin: 2rem 0;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a202c;
        }
        
        :global(.dark) .section-title {
          color: #f7fafc;
        }
        
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .visual-card {
          background: white;
          border: 2px solid;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .visual-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
        
        .visual-card.selected {
          transform: scale(1.02);
          z-index: 10;
        }
        
        :global(.dark) .visual-card {
          background: #2d3748;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        
        .card-icon {
          font-size: 2rem;
        }
        
        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: #2d3748;
        }
        
        :global(.dark) .card-title {
          color: #f7fafc;
        }
        
        .card-description {
          color: #718096;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        :global(.dark) .card-description {
          color: #cbd5e0;
        }
        
        .card-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
          animation: slideDown 0.3s ease;
        }
        
        :global(.dark) .card-details {
          border-top-color: #4a5568;
        }
        
        .card-details ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        .card-details li {
          color: #4a5568;
          font-size: 0.85rem;
          margin: 0.25rem 0;
        }
        
        :global(.dark) .card-details li {
          color: #a0aec0;
        }
        
        .connections {
          margin-top: 0.75rem;
          padding: 0.5rem;
          background: #f7fafc;
          border-radius: 6px;
          font-size: 0.85rem;
        }
        
        :global(.dark) .connections {
          background: #1a202c;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .card-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

// 프로세스 플로우 컴포넌트 (단계별)
export const ProcessFlow: React.FC<{ steps: any[] }> = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="process-flow">
      <div className="steps-indicator">
        {steps.map((step, idx) => (
          <button
            key={idx}
            className={`step-button ${activeStep === idx ? 'active' : ''} ${idx < activeStep ? 'completed' : ''}`}
            onClick={() => setActiveStep(idx)}
          >
            <span className="step-number">{idx + 1}</span>
            <span className="step-label">{step.label}</span>
          </button>
        ))}
      </div>
      
      <div className="step-content">
        <div className="step-header">
          <span className="step-icon">{steps[activeStep].icon}</span>
          <h3>{steps[activeStep].title}</h3>
        </div>
        <p className="step-description">{steps[activeStep].description}</p>
        
        {steps[activeStep].details && (
          <div className="step-details">
            {steps[activeStep].details.map((detail: any, idx: number) => (
              <div key={idx} className="detail-item">
                <span className="detail-icon">{detail.icon}</span>
                <div>
                  <strong>{detail.title}</strong>
                  <p>{detail.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="navigation-buttons">
          <button 
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="nav-button prev"
          >
            ← 이전
          </button>
          <button 
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className="nav-button next"
          >
            다음 →
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .process-flow {
          margin: 2rem 0;
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        :global(.dark) .process-flow {
          background: #2d3748;
        }
        
        .steps-indicator {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          position: relative;
        }
        
        .steps-indicator::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 40px;
          right: 40px;
          height: 2px;
          background: #e2e8f0;
          z-index: 0;
        }
        
        :global(.dark) .steps-indicator::before {
          background: #4a5568;
        }
        
        .step-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          z-index: 1;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #718096;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        :global(.dark) .step-number {
          background: #4a5568;
          color: #a0aec0;
        }
        
        .step-button.active .step-number {
          background: #667eea;
          color: white;
          transform: scale(1.2);
        }
        
        .step-button.completed .step-number {
          background: #48bb78;
          color: white;
        }
        
        .step-label {
          font-size: 0.85rem;
          color: #718096;
          text-align: center;
          max-width: 100px;
        }
        
        :global(.dark) .step-label {
          color: #a0aec0;
        }
        
        .step-button.active .step-label {
          color: #667eea;
          font-weight: 600;
        }
        
        .step-content {
          background: #f7fafc;
          border-radius: 8px;
          padding: 2rem;
          min-height: 300px;
        }
        
        :global(.dark) .step-content {
          background: #1a202c;
        }
        
        .step-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .step-icon {
          font-size: 2.5rem;
        }
        
        .step-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #2d3748;
        }
        
        :global(.dark) .step-header h3 {
          color: #f7fafc;
        }
        
        .step-description {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        :global(.dark) .step-description {
          color: #cbd5e0;
        }
        
        .step-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1.5rem 0;
        }
        
        .detail-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border-left: 3px solid #667eea;
        }
        
        :global(.dark) .detail-item {
          background: #2d3748;
        }
        
        .detail-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        
        .detail-item strong {
          display: block;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }
        
        :global(.dark) .detail-item strong {
          color: #f7fafc;
        }
        
        .detail-item p {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }
        
        :global(.dark) .detail-item p {
          color: #a0aec0;
        }
        
        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
        
        .nav-button {
          padding: 0.75rem 1.5rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .nav-button:hover:not(:disabled) {
          background: #5a67d8;
          transform: translateY(-2px);
        }
        
        .nav-button:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        @media (max-width: 768px) {
          .steps-indicator {
            overflow-x: auto;
            padding-bottom: 1rem;
          }
          
          .step-label {
            font-size: 0.75rem;
            max-width: 60px;
          }
          
          .process-flow {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

// 인터랙티브 마인드맵
export const MindMap: React.FC<{ data: any }> = ({ data }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']))

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderNode = (node: any, level = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id} className={`mindmap-node level-${level}`}>
        <div 
          className="node-content"
          onClick={() => hasChildren && toggleNode(node.id)}
          style={{ 
            marginLeft: `${level * 30}px`,
            cursor: hasChildren ? 'pointer' : 'default'
          }}
        >
          {hasChildren && (
            <span className="expand-icon">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span className="node-icon">{node.icon}</span>
          <span className="node-title">{node.title}</span>
          {node.badge && (
            <span className="node-badge" style={{ background: node.badgeColor }}>
              {node.badge}
            </span>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className="children">
            {node.children.map((child: any) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mindmap-container">
      {renderNode(data)}
      
      <style jsx>{`
        .mindmap-container {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          max-width: 100%;
          overflow-x: auto;
        }
        
        :global(.dark) .mindmap-container {
          background: #2d3748;
        }
        
        .mindmap-node {
          margin: 0.5rem 0;
        }
        
        .node-content {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #f7fafc;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        :global(.dark) .node-content {
          background: #1a202c;
        }
        
        .node-content:hover {
          background: #e2e8f0;
          transform: translateX(4px);
        }
        
        :global(.dark) .node-content:hover {
          background: #2d3748;
        }
        
        .expand-icon {
          color: #718096;
          font-size: 0.75rem;
          transition: transform 0.2s ease;
        }
        
        .node-icon {
          font-size: 1.25rem;
        }
        
        .node-title {
          font-weight: 500;
          color: #2d3748;
        }
        
        :global(.dark) .node-title {
          color: #f7fafc;
        }
        
        .node-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          color: white;
          font-weight: 600;
        }
        
        .level-0 .node-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .level-0 .node-title {
          color: white;
        }
        
        .level-1 .node-content {
          border-left: 3px solid #667eea;
        }
        
        .level-2 .node-content {
          border-left: 3px solid #48bb78;
        }
        
        .level-3 .node-content {
          border-left: 3px solid #ed8936;
        }
        
        .children {
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default { CardGrid, ProcessFlow, MindMap }