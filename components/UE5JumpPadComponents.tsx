'use client'

import React, { useCallback, useState, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  Panel,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  ConnectionMode,
  MarkerType,
  ReactFlowProvider
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ue5NodeTypes, DataTypeColors } from './UE5BlueprintNodes'
import { getLayoutedElements, getSmartLayout, getHierarchicalLayout } from './UE5BlueprintLayout'

// UE5 스타일 엣지
const defaultEdgeOptions = {
  animated: false,
  type: 'smoothstep',
  style: {
    strokeWidth: 4,
    stroke: '#ffffff',
    strokeDasharray: '0',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 18,
    height: 18,
    color: '#ffffff',
    strokeWidth: 0
  }
}

// 공통 레이아웃 버튼 컴포넌트
function LayoutControls({ onLayout, selectedLayout }: { onLayout: (type: string) => void, selectedLayout: string }) {
  return (
    <Panel position="top-right">
      <div style={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
        border: '1px solid #404040',
        borderRadius: '6px',
        padding: '8px',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => onLayout('smart')}
          style={{
            background: selectedLayout === 'smart' 
              ? 'linear-gradient(135deg, #1a5fb4, #134a8e)'
              : 'linear-gradient(135deg, #2a2a2a, #3a3a3a)',
            color: 'white',
            border: '1px solid #404040',
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          📐 Smart Layout
        </button>
        <button
          onClick={() => onLayout('hierarchical')}
          style={{
            background: selectedLayout === 'hierarchical' 
              ? 'linear-gradient(135deg, #1a5fb4, #134a8e)'
              : 'linear-gradient(135deg, #2a2a2a, #3a3a3a)',
            color: 'white',
            border: '1px solid #404040',
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          🔀 Hierarchical
        </button>
        <button
          onClick={() => onLayout('dagre')}
          style={{
            background: selectedLayout === 'dagre' 
              ? 'linear-gradient(135deg, #1a5fb4, #134a8e)'
              : 'linear-gradient(135deg, #2a2a2a, #3a3a3a)',
            color: 'white',
            border: '1px solid #404040',
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          ↔️ Horizontal
        </button>
      </div>
    </Panel>
  )
}

// 공통 블루프린트 wrapper 컴포넌트
function BlueprintFlowWrapper({ 
  initialNodes, 
  initialEdges,
  height = '450px' 
}: { 
  initialNodes: Node[], 
  initialEdges: Edge[],
  height?: string 
}) {
  // Smart Layout 적용
  const layoutedElements = useMemo(() => {
    return getSmartLayout(initialNodes, initialEdges)
  }, [initialNodes, initialEdges])

  const [nodes, setNodes] = useState(layoutedElements.nodes)
  const [edges, setEdges] = useState(layoutedElements.edges)
  const [selectedLayout, setSelectedLayout] = useState('smart')

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  // 레이아웃 변경 함수
  const onLayout = useCallback((layoutType: string) => {
    let newLayout
    
    switch(layoutType) {
      case 'hierarchical':
        newLayout = getHierarchicalLayout(nodes, edges)
        break
      case 'dagre':
        newLayout = getLayoutedElements(nodes, edges, 'LR')
        break
      case 'smart':
      default:
        newLayout = getSmartLayout(nodes, edges)
        break
    }
    
    setNodes(newLayout.nodes)
    setEdges(newLayout.edges)
    setSelectedLayout(layoutType)
  }, [nodes, edges])

  return (
    <div style={{ width: '100%', height, background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={ue5NodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#444" gap={16} />
        <Controls />
        <MiniMap 
          style={{
            backgroundColor: '#151515',
            border: '1px solid #3a3a3a',
            borderRadius: '4px'
          }}
          nodeColor={(node) => {
            if (node.type === 'ue5Event') return '#8b0000'
            if (node.type === 'ue5Get' || node.type === 'ue5Set') return '#2a2a2a'
            if (node.type === 'ue5Branch') return '#3a3a3a'
            return '#1a1a1a'
          }}
        />
        <LayoutControls onLayout={onLayout} selectedLayout={selectedLayout} />
      </ReactFlow>
    </div>
  )
}

// Jump Pad Basic Blueprint
export function JumpPadBasicBlueprint() {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 100 },
      data: { 
        label: 'On Component Begin Overlap',
        subtitle: 'Box Collision',
        execConnected: true,
        outputs: [
          { name: 'Other Actor', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '2',
      type: 'ue5Cast',
      position: { x: 350, y: 100 },
      data: {
        targetClass: 'Character',
        execInConnected: true,
        objectConnected: true,
        execOutConnected: true,
        failedConnected: false,
        asConnected: true
      }
    },
    {
      id: '3',
      type: 'ue5Function',
      position: { x: 650, y: 100 },
      data: {
        label: 'Launch Character',
        category: 'CHARACTER',
        isPure: false,
        execInConnected: true,
        execOutConnected: false,
        inputs: [
          { name: 'Target', type: 'object', connected: true },
          { name: 'Launch Velocity', type: 'vector', value: '(0, 0, 1500)', connected: false },
          { name: 'XY Override', type: 'boolean', value: false, connected: false },
          { name: 'Z Override', type: 'boolean', value: true, connected: false }
        ]
      }
    }
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1',
      source: '1',
      target: '2',
      sourceHandle: 'exec',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e2',
      source: '1',
      target: '2',
      sourceHandle: 'Other Actor',
      targetHandle: 'object',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e3',
      source: '2',
      target: '3',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e4',
      source: '2',
      target: '3',
      sourceHandle: 'cast-out',
      targetHandle: 'Target',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    }
  ]

  return (
    <ReactFlowProvider>
      <BlueprintFlowWrapper initialNodes={initialNodes} initialEdges={initialEdges} />
    </ReactFlowProvider>
  )
}

// Jump Pad Intermediate Blueprint
export function JumpPadIntermediateBlueprint() {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 150 },
      data: { 
        label: 'On Component Begin Overlap',
        subtitle: 'Box Collision',
        execConnected: true,
        outputs: [
          { name: 'Other Actor', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '2',
      type: 'ue5Get',
      position: { x: 100, y: 280 },
      data: {
        label: 'bIsActive',
        varType: 'boolean',
        connected: true
      }
    },
    {
      id: '3',
      type: 'ue5Branch',
      position: { x: 250, y: 150 },
      data: {
        execInConnected: true,
        conditionConnected: true,
        trueConnected: true,
        falseConnected: false
      }
    },
    {
      id: '4',
      type: 'ue5Cast',
      position: { x: 450, y: 150 },
      data: {
        targetClass: 'Character',
        execInConnected: true,
        objectConnected: true,
        execOutConnected: true,
        failedConnected: false,
        asConnected: true
      }
    },
    {
      id: '5',
      type: 'ue5Get',
      position: { x: 500, y: 280 },
      data: {
        label: 'LaunchDirection',
        varType: 'object',
        subtitle: 'Arrow Component',
        connected: true
      }
    },
    {
      id: '6',
      type: 'ue5Function',
      position: { x: 700, y: 250 },
      data: {
        label: 'Get Forward Vector',
        category: 'UTILITIES',
        isPure: true,
        inputs: [
          { name: 'Target', type: 'object', connected: true }
        ],
        outputs: [
          { name: 'Forward', type: 'vector', connected: true }
        ]
      }
    },
    {
      id: '7',
      type: 'ue5Get',
      position: { x: 700, y: 380 },
      data: {
        label: 'JumpForce',
        varType: 'float',
        connected: true
      }
    },
    {
      id: '8',
      type: 'ue5Function',
      position: { x: 900, y: 280 },
      data: {
        label: 'Multiply',
        subtitle: 'Vector * Float',
        category: 'MATH',
        isPure: true,
        inputs: [
          { name: 'A', type: 'vector', connected: true },
          { name: 'B', type: 'float', connected: true }
        ],
        outputs: [
          { name: 'Result', type: 'vector', connected: true }
        ]
      }
    },
    {
      id: '9',
      type: 'ue5Function',
      position: { x: 1100, y: 150 },
      data: {
        label: 'Launch Character',
        category: 'CHARACTER',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'Target', type: 'object', connected: true },
          { name: 'Launch Velocity', type: 'vector', connected: true },
          { name: 'XY Override', type: 'boolean', value: true, connected: false },
          { name: 'Z Override', type: 'boolean', value: true, connected: false }
        ]
      }
    },
    {
      id: '10',
      type: 'ue5Function',
      position: { x: 1350, y: 150 },
      data: {
        label: 'Play Effects',
        subtitle: 'Custom Event',
        category: 'CUSTOM',
        isPure: false,
        execInConnected: true,
        execOutConnected: true
      }
    },
    {
      id: '11',
      type: 'ue5Function',
      position: { x: 1600, y: 150 },
      data: {
        label: 'Handle Reactivation',
        subtitle: 'Custom Event',
        category: 'CUSTOM',
        isPure: false,
        execInConnected: true,
        execOutConnected: false
      }
    }
  ]

  const initialEdges: Edge[] = [
    // Execution flow
    {
      id: 'e1',
      source: '1',
      target: '3',
      sourceHandle: 'exec',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e2',
      source: '3',
      target: '4',
      sourceHandle: 'true',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e3',
      source: '4',
      target: '9',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e4',
      source: '9',
      target: '10',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e5',
      source: '10',
      target: '11',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    // Data flow
    {
      id: 'e6',
      source: '1',
      target: '4',
      sourceHandle: 'Other Actor',
      targetHandle: 'object',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e7',
      source: '2',
      target: '3',
      sourceHandle: 'value',
      targetHandle: 'condition',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e8',
      source: '4',
      target: '9',
      sourceHandle: 'cast-out',
      targetHandle: 'Target',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e9',
      source: '5',
      target: '6',
      sourceHandle: 'value',
      targetHandle: 'Target',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e10',
      source: '6',
      target: '8',
      sourceHandle: 'Forward',
      targetHandle: 'A',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.vector }
    },
    {
      id: 'e11',
      source: '7',
      target: '8',
      sourceHandle: 'value',
      targetHandle: 'B',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.float }
    },
    {
      id: 'e12',
      source: '8',
      target: '9',
      sourceHandle: 'Result',
      targetHandle: 'Launch Velocity',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.vector }
    }
  ]

  return (
    <ReactFlowProvider>
      <BlueprintFlowWrapper initialNodes={initialNodes} initialEdges={initialEdges} height="500px" />
    </ReactFlowProvider>
  )
}

// Handle Reactivation Blueprint  
export function HandleReactivationBlueprint() {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 100 },
      data: { 
        label: 'Handle Reactivation',
        subtitle: 'Custom Event',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Get',
      position: { x: 100, y: 200 },
      data: {
        label: 'bCanReactivate',
        varType: 'boolean',
        connected: true
      }
    },
    {
      id: '3',
      type: 'ue5Branch',
      position: { x: 250, y: 100 },
      data: {
        execInConnected: true,
        conditionConnected: true,
        trueConnected: true,
        falseConnected: false
      }
    },
    {
      id: '4',
      type: 'ue5Set',
      position: { x: 450, y: 100 },
      data: {
        label: 'bIsActive',
        varType: 'boolean',
        value: false,
        execInConnected: true,
        execOutConnected: true,
        inputConnected: false
      }
    },
    {
      id: '5',
      type: 'ue5Get',
      position: { x: 500, y: 230 },
      data: {
        label: 'ReactivateDelay',
        varType: 'float',
        connected: true
      }
    },
    {
      id: '6',
      type: 'ue5Function',
      position: { x: 700, y: 100 },
      data: {
        label: 'Set Timer by Function Name',
        category: 'UTILITIES',
        isPure: false,
        execInConnected: true,
        execOutConnected: false,
        inputs: [
          { name: 'Function Name', type: 'string', value: 'ReEnable Jump Pad', connected: false },
          { name: 'Time', type: 'float', connected: true },
          { name: 'Looping', type: 'boolean', value: false, connected: false }
        ]
      }
    }
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1',
      source: '1',
      target: '3',
      sourceHandle: 'exec',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e2',
      source: '2',
      target: '3',
      sourceHandle: 'value',
      targetHandle: 'condition',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e3',
      source: '3',
      target: '4',
      sourceHandle: 'true',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e4',
      source: '4',
      target: '6',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e5',
      source: '5',
      target: '6',
      sourceHandle: 'value',
      targetHandle: 'Time',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.float }
    }
  ]

  return (
    <ReactFlowProvider>
      <BlueprintFlowWrapper initialNodes={initialNodes} initialEdges={initialEdges} height="350px" />
    </ReactFlowProvider>
  )
}