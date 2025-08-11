'use client'

import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
  ConnectionMode,
  Panel,
  MarkerType,
  useReactFlow,
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
  },
  labelStyle: {
    fill: '#ffffff',
    fontWeight: 600,
    fontSize: 10
  },
  labelBgStyle: {
    fill: 'rgba(0,0,0,0.7)',
    fillOpacity: 0.7
  }
}

// 데이터 타입별 엣지 스타일
const getEdgeStyle = (dataType: string) => {
  const color = DataTypeColors[dataType as keyof typeof DataTypeColors] || '#0088ff'
  return {
    animated: false,
    type: 'smoothstep',
    style: {
      strokeWidth: 3,
      stroke: color,
      strokeDasharray: '0',
      filter: `drop-shadow(0 0 3px ${color}44)`
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 12,
      height: 12,
      color: color,
      strokeWidth: 0
    }
  }
}

// 1. 기본 Print String 예제 (Hello World)
export function UE5PrintString() {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 150 },
      data: { 
        label: 'Event BeginPlay',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Function',
      position: { x: 450, y: 130 },
      data: { 
        label: 'Print String',
        category: 'DEVELOPMENT',
        isPure: false,
        execInConnected: true,
        execOutConnected: false,
        inputs: [
          { name: 'In String', type: 'string', value: 'Hello World!', connected: false },
          { name: 'Print to Screen', type: 'boolean', value: true, connected: false },
          { name: 'Print to Log', type: 'boolean', value: true, connected: false },
          { name: 'Text Color', type: 'struct', connected: false },
          { name: 'Duration', type: 'float', value: '2.0', connected: false }
        ],
        outputs: []
      }
    }
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      sourceHandle: 'exec',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    }
  ]

  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source)
      const isExecConnection = params.sourceHandle?.includes('exec') || params.targetHandle?.includes('exec')
      
      setEdges((eds) => addEdge({
        ...params,
        ...(isExecConnection ? defaultEdgeOptions : getEdgeStyle('object'))
      }, eds))
    },
    [nodes]
  )

  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', 
      borderRadius: '8px', 
      border: '1px solid #2a2a2a',
      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={ue5NodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep'
        }}
      >
        <Background 
          color="#1a1a1a" 
          gap={20} 
          size={1}
          style={{ opacity: 0.5 }}
        />
        <Controls />
      </ReactFlow>
    </div>
  )
}

// 2. 변수 Get/Set 예제 - 자동 레이아웃 적용
function UE5VariableFlowInner() {
  const reactFlowInstance = useReactFlow()
  
  const nodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 250 },
      data: { 
        label: 'Event Tick',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Get',
      position: { x: 300, y: 100 },
      data: { 
        label: 'Player Health',
        varType: 'float',
        connected: true
      }
    },
    {
      id: '3',
      type: 'ue5Function',
      position: { x: 550, y: 80 },
      data: { 
        label: 'Subtract',
        category: 'MATH',
        isPure: true,
        inputs: [
          { name: 'A', type: 'float', connected: true },
          { name: 'B', type: 'float', value: '1.0', connected: false }
        ],
        outputs: [
          { name: 'Result', type: 'float', connected: true }
        ]
      }
    },
    {
      id: '4',
      type: 'ue5Set',
      position: { x: 450, y: 270 },
      data: { 
        label: 'Player Health',
        varType: 'float',
        execInConnected: true,
        execOutConnected: true,
        valueInConnected: true,
        valueOutConnected: false
      }
    },
    {
      id: '5',
      type: 'ue5Branch',
      position: { x: 750, y: 250 },
      data: {
        execInConnected: true,
        conditionConnected: true,
        trueConnected: true,
        falseConnected: false
      }
    },
    {
      id: '6',
      type: 'ue5Function',
      position: { x: 550, y: 420 },
      data: { 
        label: 'Less Than',
        category: 'MATH',
        isPure: true,
        inputs: [
          { name: 'A', type: 'float', connected: true },
          { name: 'B', type: 'float', value: '0', connected: false }
        ],
        outputs: [
          { name: 'Result', type: 'boolean', connected: true }
        ]
      }
    },
    {
      id: '7',
      type: 'ue5Function',
      position: { x: 1050, y: 230 },
      data: { 
        label: 'Destroy Actor',
        category: 'ACTOR',
        isPure: false,
        execInConnected: true,
        inputs: [
          { name: 'Target', type: 'object', value: 'Self', connected: false }
        ],
        outputs: []
      }
    }
  ]

  const edges: Edge[] = [
    // Execution flow
    {
      id: 'e1-4',
      source: '1',
      target: '4',
      sourceHandle: 'exec',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e5-7',
      source: '5',
      target: '7',
      sourceHandle: 'true',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    // Data flow
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      sourceHandle: 'value',
      targetHandle: 'input-A',
      ...getEdgeStyle('float')
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      sourceHandle: 'output-Result',
      targetHandle: 'value-in',
      ...getEdgeStyle('float')
    },
    {
      id: 'e4-6',
      source: '4',
      target: '6',
      sourceHandle: 'value-out',
      targetHandle: 'input-A',
      ...getEdgeStyle('float')
    },
    {
      id: 'e6-5',
      source: '6',
      target: '5',
      sourceHandle: 'output-Result',
      targetHandle: 'condition',
      ...getEdgeStyle('boolean')
    }
  ]

  // 초기 노드와 엣지를 자동 레이아웃으로 배치
  const { nodes: layoutedNodes, edges: layoutedEdges } = getSmartLayout(nodes, edges)
  
  const [nodesState, setNodes] = useState(layoutedNodes)
  const [edgesState, setEdges] = useState(layoutedEdges)
  const [selectedLayout, setSelectedLayout] = useState('smart')
  
  // 레이아웃 변경 함수
  const onLayout = useCallback(
    (layoutType: string) => {
      let newLayout
      
      switch(layoutType) {
        case 'hierarchical':
          newLayout = getHierarchicalLayout(nodesState, edgesState)
          break
        case 'dagre':
          newLayout = getLayoutedElements(nodesState, edgesState, 'LR')
          break
        case 'smart':
        default:
          newLayout = getSmartLayout(nodesState, edgesState)
          break
      }
      
      setNodes(newLayout.nodes)
      setEdges(newLayout.edges)
      setSelectedLayout(layoutType)
      
      // 레이아웃 후 화면에 맞춤
      window.requestAnimationFrame(() => {
        reactFlowInstance.fitView({ padding: 0.2 })
      })
    },
    [nodesState, edgesState, reactFlowInstance]
  )
  
  // 초기 렌더링 시 화면에 맞춤
  useLayoutEffect(() => {
    reactFlowInstance.fitView({ padding: 0.2 })
  }, [])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  return (
    <div style={{ 
      width: '100%', 
      height: '550px', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', 
      borderRadius: '8px', 
      border: '1px solid #2a2a2a',
      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
    }}>
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={ue5NodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep'
        }}
      >
        <Background 
          color="#1a1a1a" 
          gap={20} 
          size={1}
          style={{ opacity: 0.5 }}
        />
        <Controls />
        <MiniMap 
          style={{
            backgroundColor: '#151515',
            border: '1px solid #3a3a3a',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}
          nodeColor={(node) => {
            if (node.type === 'ue5Event') return '#5b0000'
            if (node.type === 'ue5Get' || node.type === 'ue5Set') return '#2a2a2a'
            if (node.type === 'ue5Branch') return '#3a3a3a'
            return '#1a1a1a'
          }}
        />
        <Panel position="top-left">
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
              Smart Layout
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
              Hierarchical
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
              Dagre Auto
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export function UE5VariableFlow() {
  return (
    <ReactFlowProvider>
      <UE5VariableFlowInner />
    </ReactFlowProvider>
  )
}

// 3. 복잡한 게임 로직 예제 - 자동 레이아웃 적용
function UE5ComplexGameLogicInner() {
  const reactFlowInstance = useReactFlow()
  
  const nodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 300 },
      data: { 
        label: 'Event OnDamage',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Get',
      position: { x: 250, y: 150 },
      data: { 
        label: 'Current Health',
        varType: 'float',
        connected: true
      }
    },
    {
      id: '3',
      type: 'ue5Get',
      position: { x: 250, y: 450 },
      data: { 
        label: 'Damage Amount',
        varType: 'float',
        connected: true
      }
    },
    {
      id: '4',
      type: 'ue5Function',
      position: { x: 500, y: 250 },
      data: { 
        label: 'Subtract',
        category: 'MATH',
        isPure: true,
        inputs: [
          { name: 'A', type: 'float', connected: true },
          { name: 'B', type: 'float', connected: true }
        ],
        outputs: [
          { name: 'Result', type: 'float', connected: true }
        ]
      }
    },
    {
      id: '5',
      type: 'ue5Function',
      position: { x: 750, y: 250 },
      data: { 
        label: 'Clamp',
        category: 'MATH',
        isPure: true,
        inputs: [
          { name: 'Value', type: 'float', connected: true },
          { name: 'Min', type: 'float', value: '0', connected: false },
          { name: 'Max', type: 'float', value: '100', connected: false }
        ],
        outputs: [
          { name: 'Result', type: 'float', connected: true }
        ]
      }
    },
    {
      id: '6',
      type: 'ue5Set',
      position: { x: 450, y: 500 },
      data: { 
        label: 'Current Health',
        varType: 'float',
        execInConnected: true,
        execOutConnected: true,
        valueInConnected: true
      }
    },
    {
      id: '7',
      type: 'ue5Branch',
      position: { x: 750, y: 500 },
      data: {
        execInConnected: true,
        conditionConnected: true,
        trueConnected: true,
        falseConnected: true
      }
    },
    {
      id: '8',
      type: 'ue5Function',
      position: { x: 550, y: 650 },
      data: { 
        label: 'Less Equal',
        category: 'MATH',
        isPure: true,
        inputs: [
          { name: 'A', type: 'float', connected: true },
          { name: 'B', type: 'float', value: '0', connected: false }
        ],
        outputs: [
          { name: 'Result', type: 'boolean', connected: true }
        ]
      }
    },
    {
      id: '9',
      type: 'ue5Function',
      position: { x: 1050, y: 450 },
      data: { 
        label: 'Death Event',
        category: 'CUSTOM',
        isPure: false,
        execInConnected: true,
        inputs: [],
        outputs: []
      }
    },
    {
      id: '10',
      type: 'ue5Function',
      position: { x: 1050, y: 550 },
      data: { 
        label: 'Update Health Bar',
        category: 'UI',
        isPure: false,
        execInConnected: true,
        inputs: [
          { name: 'Health Percent', type: 'float', connected: true }
        ],
        outputs: []
      }
    },
    {
      id: '11',
      type: 'ue5Function',
      position: { x: 800, y: 700 },
      data: { 
        label: 'Divide',
        category: 'MATH',
        isPure: true,
        inputs: [
          { name: 'A', type: 'float', connected: true },
          { name: 'B', type: 'float', value: '100', connected: false }
        ],
        outputs: [
          { name: 'Result', type: 'float', connected: true }
        ]
      }
    }
  ]

  const edges: Edge[] = [
    // Execution flow
    {
      id: 'e1-6',
      source: '1',
      target: '6',
      sourceHandle: 'exec',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e6-7',
      source: '6',
      target: '7',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e7-9',
      source: '7',
      target: '9',
      sourceHandle: 'true',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e7-10',
      source: '7',
      target: '10',
      sourceHandle: 'false',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    // Data flow
    {
      id: 'e2-4a',
      source: '2',
      target: '4',
      sourceHandle: 'value',
      targetHandle: 'input-A',
      ...getEdgeStyle('float')
    },
    {
      id: 'e3-4b',
      source: '3',
      target: '4',
      sourceHandle: 'value',
      targetHandle: 'input-B',
      ...getEdgeStyle('float')
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      sourceHandle: 'output-Result',
      targetHandle: 'input-Value',
      ...getEdgeStyle('float')
    },
    {
      id: 'e5-6',
      source: '5',
      target: '6',
      sourceHandle: 'output-Result',
      targetHandle: 'value-in',
      ...getEdgeStyle('float')
    },
    {
      id: 'e6-8',
      source: '6',
      target: '8',
      sourceHandle: 'value-out',
      targetHandle: 'input-A',
      ...getEdgeStyle('float')
    },
    {
      id: 'e8-7',
      source: '8',
      target: '7',
      sourceHandle: 'output-Result',
      targetHandle: 'condition',
      ...getEdgeStyle('boolean')
    },
    {
      id: 'e6-11',
      source: '6',
      target: '11',
      sourceHandle: 'value-out',
      targetHandle: 'input-A',
      ...getEdgeStyle('float')
    },
    {
      id: 'e11-10',
      source: '11',
      target: '10',
      sourceHandle: 'output-Result',
      targetHandle: 'input-Health Percent',
      ...getEdgeStyle('float')
    }
  ]

  // 초기 노드와 엣지를 자동 레이아웃으로 배치
  const { nodes: layoutedNodes, edges: layoutedEdges } = getHierarchicalLayout(nodes, edges)
  
  const [nodesState, setNodes] = useState(layoutedNodes)
  const [edgesState, setEdges] = useState(layoutedEdges)
  const [selectedLayout, setSelectedLayout] = useState('hierarchical')
  
  // 레이아웃 변경 함수
  const onLayout = useCallback(
    (layoutType: string) => {
      let newLayout
      
      switch(layoutType) {
        case 'hierarchical':
          newLayout = getHierarchicalLayout(nodesState, edgesState)
          break
        case 'dagre':
          newLayout = getLayoutedElements(nodesState, edgesState, 'LR')
          break
        case 'smart':
        default:
          newLayout = getSmartLayout(nodesState, edgesState)
          break
      }
      
      setNodes(newLayout.nodes)
      setEdges(newLayout.edges)
      setSelectedLayout(layoutType)
      
      // 레이아웃 후 화면에 맞춤
      window.requestAnimationFrame(() => {
        reactFlowInstance.fitView({ padding: 0.2 })
      })
    },
    [nodesState, edgesState, reactFlowInstance]
  )
  
  // 초기 렌더링 시 화면에 맞춤
  useLayoutEffect(() => {
    reactFlowInstance.fitView({ padding: 0.2 })
  }, [])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  return (
    <div style={{ 
      width: '100%', 
      height: '750px', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', 
      borderRadius: '8px', 
      border: '1px solid #2a2a2a',
      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
    }}>
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={ue5NodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep'
        }}
      >
        <Background 
          color="#1a1a1a" 
          gap={20} 
          size={1}
          style={{ opacity: 0.5 }}
        />
        <Controls />
        <Panel position="top-left">
          <div style={{
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
            border: '1px solid #404040',
            borderRadius: '6px',
            padding: '8px',
            display: 'flex',
            gap: '8px'
          }}>
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
              Hierarchical
            </button>
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
              Smart Layout
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
              Dagre Auto
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export function UE5ComplexGameLogic() {
  return (
    <ReactFlowProvider>
      <UE5ComplexGameLogicInner />
    </ReactFlowProvider>
  )
}

// Jump Pad Basic Blueprint - 기본 점프패드
function JumpPadBasicBlueprintInner() {
  const reactFlowInstance = useReactFlow()
  
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
      type: 'ue5Cast',
      position: { x: 350, y: 150 },
      data: { 
        targetClass: 'Character',
        execInConnected: true,
        execOutConnected: true,
        objectConnected: true,
        castOutConnected: true
      }
    },
    {
      id: '3',
      type: 'ue5Function',
      position: { x: 650, y: 150 },
      data: { 
        label: 'Launch Character',
        category: 'CHARACTER',
        isPure: false,
        execInConnected: true,
        inputs: [
          { name: 'Target', type: 'object', connected: true },
          { name: 'Launch Velocity', type: 'vector', value: '0, 0, 1500' },
          { name: 'XY Override', type: 'boolean', value: 'false' },
          { name: 'Z Override', type: 'boolean', value: 'true' }
        ]
      }
    }
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1',
      source: '1',
      target: '2',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      type: 'smoothstep',
      style: { strokeWidth: 4, stroke: '#ffffff' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 18,
        height: 18,
        color: '#ffffff'
      }
    },
    {
      id: 'e2',
      source: '1',
      target: '2',
      sourceHandle: 'output-0',
      targetHandle: 'object-in',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e3',
      source: '2',
      target: '3',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      type: 'smoothstep',
      style: { strokeWidth: 4, stroke: '#ffffff' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 18,
        height: 18,
        color: '#ffffff'
      }
    },
    {
      id: 'e4',
      source: '2',
      target: '3',
      sourceHandle: 'cast-out',
      targetHandle: 'input-0',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    }
  ]
  
  // 자동 레이아웃 적용
  const layoutedElements = useMemo(() => {
    return getSmartLayout(initialNodes, initialEdges)
  }, [])

  return (
    <div style={{ width: '100%', height: '400px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
      <ReactFlow
        nodes={layoutedElements.nodes}
        edges={layoutedElements.edges}
        nodeTypes={ue5NodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#444" gap={16} />
        <MiniMap 
          nodeColor={node => {
            switch(node.type) {
              case 'ue5Event': return '#a82929'
              case 'ue5Function': return '#2b5f3f'
              case 'ue5Cast': return '#2b3d5f'
              default: return '#666'
            }
          }}
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #444'
          }}
        />
      </ReactFlow>
    </div>
  )
}

export function JumpPadBasicBlueprint() {
  return (
    <ReactFlowProvider>
      <JumpPadBasicBlueprintInner />
    </ReactFlowProvider>
  )
}

// Jump Pad Intermediate Blueprint - 중급 점프패드 (변수와 방향 제어)
function JumpPadIntermediateBlueprintInner() {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 200 },
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
      position: { x: 250, y: 50 },
      data: { 
        label: 'Is Active',
        varType: 'boolean',
        connected: true
      }
    },
    {
      id: '3',
      type: 'ue5Branch',
      position: { x: 350, y: 200 },
      data: {
        execInConnected: true,
        execTrueConnected: true,
        conditionConnected: true
      }
    },
    {
      id: '4',
      type: 'ue5Cast',
      position: { x: 550, y: 200 },
      data: { 
        targetClass: 'Character',
        execInConnected: true,
        execOutConnected: true,
        objectConnected: true,
        castOutConnected: true
      }
    },
    {
      id: '5',
      type: 'ue5Function',
      position: { x: 750, y: 350 },
      data: { 
        label: 'Get Forward Vector',
        subtitle: 'Arrow Component',
        category: 'TRANSFORM',
        isPure: true,
        outputs: [
          { name: 'Forward', type: 'vector', connected: true }
        ]
      }
    },
    {
      id: '6',
      type: 'ue5Get',
      position: { x: 750, y: 450 },
      data: { 
        label: 'Jump Force',
        varType: 'float',
        value: '2000',
        connected: true
      }
    },
    {
      id: '7',
      type: 'ue5Function',
      position: { x: 950, y: 350 },
      data: { 
        label: 'Vector * Float',
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
      id: '8',
      type: 'ue5Function',
      position: { x: 850, y: 200 },
      data: { 
        label: 'Launch Character',
        category: 'CHARACTER',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'Target', type: 'object', connected: true },
          { name: 'Launch Velocity', type: 'vector', connected: true },
          { name: 'XY Override', type: 'boolean', value: 'true' },
          { name: 'Z Override', type: 'boolean', value: 'true' }
        ]
      }
    },
    {
      id: '9',
      type: 'ue5Function',
      position: { x: 1150, y: 200 },
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
      id: '10',
      type: 'ue5Function',
      position: { x: 1350, y: 200 },
      data: { 
        label: 'Handle Reactivation',
        subtitle: 'Custom Event',
        category: 'CUSTOM',
        isPure: false,
        execInConnected: true
      }
    }
  ]

  const initialEdges: Edge[] = [
    // Execution flow
    {
      id: 'e1',
      source: '1',
      target: '3',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      type: 'smoothstep',
      style: { strokeWidth: 4, stroke: '#ffffff' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#ffffff' }
    },
    {
      id: 'e2',
      source: '2',
      target: '3',
      sourceHandle: 'output',
      targetHandle: 'condition',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e3',
      source: '3',
      target: '4',
      sourceHandle: 'exec-true',
      targetHandle: 'exec-in',
      type: 'smoothstep',
      style: { strokeWidth: 4, stroke: '#ffffff' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#ffffff' }
    },
    {
      id: 'e4',
      source: '1',
      target: '4',
      sourceHandle: 'output-0',
      targetHandle: 'object-in',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e5',
      source: '4',
      target: '8',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      type: 'smoothstep',
      style: { strokeWidth: 4, stroke: '#ffffff' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#ffffff' }
    },
    {
      id: 'e6',
      source: '4',
      target: '8',
      sourceHandle: 'cast-out',
      targetHandle: 'input-0',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e7',
      source: '5',
      target: '7',
      sourceHandle: 'output-0',
      targetHandle: 'input-0',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.vector }
    },
    {
      id: 'e8',
      source: '6',
      target: '7',
      sourceHandle: 'output',
      targetHandle: 'input-1',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.float }
    },
    {
      id: 'e9',
      source: '7',
      target: '8',
      sourceHandle: 'output-0',
      targetHandle: 'input-1',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.vector }
    },
    {
      id: 'e10',
      source: '8',
      target: '9',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      type: 'smoothstep',
      style: { strokeWidth: 4, stroke: '#ffffff' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#ffffff' }
    },
    {
      id: 'e11',
      source: '9',
      target: '10',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      type: 'smoothstep',
      style: { strokeWidth: 4, stroke: '#ffffff' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#ffffff' }
    }
  ]
  
  // 자동 레이아웃 적용 (계층형)
  const layoutedElements = useMemo(() => {
    return getHierarchicalLayout(initialNodes, initialEdges)
  }, [])

  return (
    <div style={{ width: '100%', height: '500px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
      <ReactFlow
        nodes={layoutedElements.nodes}
        edges={layoutedElements.edges}
        nodeTypes={ue5NodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.4}
        maxZoom={1.5}
      >
        <Background color="#444" gap={16} />
        <MiniMap 
          nodeColor={node => {
            switch(node.type) {
              case 'ue5Event': return '#a82929'
              case 'ue5Function': return '#2b5f3f'
              case 'ue5Cast': return '#2b3d5f'
              case 'ue5Get': return '#4a4a4a'
              case 'ue5Branch': return '#8b5a00'
              default: return '#666'
            }
          }}
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #444'
          }}
        />
      </ReactFlow>
    </div>
  )
}

export function JumpPadIntermediateBlueprint() {
  return (
    <ReactFlowProvider>
      <JumpPadIntermediateBlueprintInner />
    </ReactFlowProvider>
  )
}

// Handle Reactivation 커스텀 이벤트 블루프린트
function HandleReactivationBlueprintInner() {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 150 },
      data: { 
        label: 'Handle Reactivation',
        subtitle: 'Custom Event',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Get',
      position: { x: 250, y: 50 },
      data: { 
        label: 'Can Reactivate',
        varType: 'boolean',
        value: 'true',
        connected: true
      }
    },
    {
      id: '3',
      type: 'ue5Branch',
      position: { x: 350, y: 150 },
      data: {
        execInConnected: true,
        execTrueConnected: true,
        conditionConnected: true
      }
    },
    {
      id: '4',
      type: 'ue5Set',
      position: { x: 550, y: 100 },
      data: { 
        label: 'Is Active',
        varType: 'boolean',
        value: 'false',
        execInConnected: true,
        execOutConnected: true
      }
    },
    {
      id: '5',
      type: 'ue5Function',
      position: { x: 750, y: 100 },
      data: { 
        label: 'Set Timer by Event',
        category: 'TIME',
        isPure: false,
        execInConnected: true,
        inputs: [
          { name: 'Time', type: 'float', value: '0.5' },
          { name: 'Event', type: 'delegate', value: 'ReEnableJumpPad' }
        ]
      }
    }
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1',
      source: '1',
      target: '3',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      type: 'smoothstep',
      style: { strokeWidth: 4, stroke: '#ffffff' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#ffffff' }
    },
    {
      id: 'e2',
      source: '2',
      target: '3',
      sourceHandle: 'output',
      targetHandle: 'condition',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e3',
      source: '3',
      target: '4',
      sourceHandle: 'exec-true',
      targetHandle: 'exec-in',
      type: 'smoothstep',
      style: { strokeWidth: 4, stroke: '#ffffff' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#ffffff' }
    },
    {
      id: 'e4',
      source: '4',
      target: '5',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      type: 'smoothstep',
      style: { strokeWidth: 4, stroke: '#ffffff' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#ffffff' }
    }
  ]
  
  // 자동 레이아웃 적용
  const layoutedElements = useMemo(() => {
    return getSmartLayout(initialNodes, initialEdges)
  }, [])

  return (
    <div style={{ width: '100%', height: '350px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
      <ReactFlow
        nodes={layoutedElements.nodes}
        edges={layoutedElements.edges}
        nodeTypes={ue5NodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#444" gap={16} />
      </ReactFlow>
    </div>
  )
}

export function HandleReactivationBlueprint() {
  return (
    <ReactFlowProvider>
      <HandleReactivationBlueprintInner />
    </ReactFlowProvider>
  )
}