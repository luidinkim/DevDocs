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
  ReactFlowProvider,
  useReactFlow
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

// Moving Platform Blueprint - 움직이는 플랫폼
export function MovingPlatformBlueprint() {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 100 },
      data: { 
        label: 'Event BeginPlay',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Function',
      position: { x: 250, y: 80 },
      data: {
        label: 'Get Spline Length',
        category: 'SPLINE',
        isPure: true,
        inputs: [
          { name: 'Target', type: 'object', value: 'Spline Component', connected: false }
        ],
        outputs: [
          { name: 'Length', type: 'float', connected: true }
        ]
      }
    },
    {
      id: '3',
      type: 'ue5Set',
      position: { x: 500, y: 100 },
      data: {
        label: 'SplineLength',
        varType: 'float',
        execInConnected: true,
        execOutConnected: true,
        inputConnected: true
      }
    },
    {
      id: '4',
      type: 'ue5Event',
      position: { x: 50, y: 250 },
      data: { 
        label: 'Event Tick',
        execConnected: true,
        outputs: [
          { name: 'Delta Seconds', type: 'float', connected: true }
        ]
      }
    },
    {
      id: '5',
      type: 'ue5Get',
      position: { x: 100, y: 380 },
      data: {
        label: 'bIsMoving',
        varType: 'boolean',
        connected: true
      }
    },
    {
      id: '6',
      type: 'ue5Branch',
      position: { x: 300, y: 250 },
      data: {
        execInConnected: true,
        conditionConnected: true,
        trueConnected: true,
        falseConnected: false
      }
    },
    {
      id: '7',
      type: 'ue5Function',
      position: { x: 550, y: 250 },
      data: {
        label: 'Update Platform Position',
        category: 'MOVEMENT',
        isPure: false,
        execInConnected: true,
        execOutConnected: false,
        inputs: [
          { name: 'Delta Time', type: 'float', connected: true },
          { name: 'Move Speed', type: 'float', value: '300', connected: false }
        ],
        outputs: []
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
      sourceHandle: 'Length',
      targetHandle: 'value-in',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.float }
    },
    {
      id: 'e3',
      source: '4',
      target: '6',
      sourceHandle: 'exec',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e4',
      source: '5',
      target: '6',
      sourceHandle: 'value',
      targetHandle: 'condition',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e5',
      source: '6',
      target: '7',
      sourceHandle: 'true',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e6',
      source: '4',
      target: '7',
      sourceHandle: 'Delta Seconds',
      targetHandle: 'Delta Time',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.float }
    }
  ]

  return (
    <ReactFlowProvider>
      <BlueprintFlowWrapper initialNodes={initialNodes} initialEdges={initialEdges} />
    </ReactFlowProvider>
  )
}

// Spline Movement Blueprint - 플레이어 Attach 처리
export function SplineMovementBlueprint() {
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
      type: 'ue5CastNode',
      position: { x: 350, y: 150 },
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
        label: 'Add to Array',
        subtitle: 'PlayersOnPlatform',
        category: 'ARRAY',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'Target Array', type: 'object', value: 'PlayersOnPlatform', connected: false },
          { name: 'New Item', type: 'object', connected: true }
        ],
        outputs: []
      }
    },
    {
      id: '4',
      type: 'ue5Function',
      position: { x: 950, y: 100 },
      data: {
        label: 'Attach to Component',
        category: 'ATTACHMENT',
        isPure: false,
        execInConnected: true,
        execOutConnected: false,
        inputs: [
          { name: 'Target', type: 'object', connected: true },
          { name: 'Parent', type: 'object', value: 'Platform Mesh', connected: false },
          { name: 'Socket Name', type: 'string', value: 'None', connected: false },
          { name: 'Location Rule', type: 'enum', value: 'Keep World', connected: false },
          { name: 'Rotation Rule', type: 'enum', value: 'Keep World', connected: false },
          { name: 'Scale Rule', type: 'enum', value: 'Keep World', connected: false },
          { name: 'Weld Bodies', type: 'boolean', value: false, connected: false }
        ],
        outputs: []
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
      ...defaultEdgeOptions
    },
    {
      id: 'e4',
      source: '2',
      target: '3',
      sourceHandle: 'as-character',
      targetHandle: 'New Item',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e5',
      source: '3',
      target: '4',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e6',
      source: '2',
      target: '4',
      sourceHandle: 'as-character',
      targetHandle: 'Target',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    }
  ]

  // Smart Layout 적용
  const layoutedElements = useMemo(() => {
    return getSmartLayout(initialNodes, initialEdges)
  }, [])

  const [nodes, setNodes] = useState(layoutedElements.nodes)
  const [edges, setEdges] = useState(layoutedElements.edges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '350px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
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
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}

// Teleport Portal Blueprint - 포털 초기화
export function TeleportPortalBlueprint() {
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
      type: 'ue5Get',
      position: { x: 100, y: 250 },
      data: {
        label: 'LinkedPortal',
        varType: 'object',
        connected: true
      }
    },
    {
      id: '3',
      type: 'ue5Function',
      position: { x: 300, y: 150 },
      data: {
        label: 'Is Valid',
        category: 'UTILITIES',
        isPure: true,
        inputs: [
          { name: 'Input Object', type: 'object', connected: true }
        ],
        outputs: [
          { name: 'Is Valid', type: 'boolean', connected: true }
        ]
      }
    },
    {
      id: '4',
      type: 'ue5Branch',
      position: { x: 550, y: 150 },
      data: {
        execInConnected: true,
        conditionConnected: true,
        trueConnected: true,
        falseConnected: false
      }
    },
    {
      id: '5',
      type: 'ue5Function',
      position: { x: 800, y: 100 },
      data: {
        label: 'Create Dynamic Material Instance',
        category: 'MATERIAL',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'Source Material', type: 'object', value: 'M_Portal', connected: false },
          { name: 'Element Index', type: 'integer', value: '0', connected: false }
        ],
        outputs: [
          { name: 'Return Value', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '6',
      type: 'ue5Function',
      position: { x: 1100, y: 100 },
      data: {
        label: 'Set Vector Parameter Value',
        category: 'MATERIAL',
        isPure: false,
        execInConnected: true,
        execOutConnected: false,
        inputs: [
          { name: 'Target', type: 'object', connected: true },
          { name: 'Parameter Name', type: 'string', value: 'PortalColor', connected: false },
          { name: 'Value', type: 'vector', value: '(0,0.5,1)', connected: false }
        ],
        outputs: []
      }
    }
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1',
      source: '1',
      target: '4',
      sourceHandle: 'exec',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e2',
      source: '2',
      target: '3',
      sourceHandle: 'value',
      targetHandle: 'Input Object',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e3',
      source: '3',
      target: '4',
      sourceHandle: 'Is Valid',
      targetHandle: 'condition',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e4',
      source: '4',
      target: '5',
      sourceHandle: 'true',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e5',
      source: '5',
      target: '6',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e6',
      source: '5',
      target: '6',
      sourceHandle: 'Return Value',
      targetHandle: 'Target',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    }
  ]

  // Smart Layout 적용
  const layoutedElements = useMemo(() => {
    return getSmartLayout(initialNodes, initialEdges)
  }, [])

  const [nodes, setNodes] = useState(layoutedElements.nodes)
  const [edges, setEdges] = useState(layoutedElements.edges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '350px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
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
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}

// Portal Overlap Blueprint - 텔레포트 처리
export function PortalOverlapBlueprint() {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 200 },
      data: { 
        label: 'On Component Begin Overlap',
        subtitle: 'Capsule Component',
        execConnected: true,
        outputs: [
          { name: 'Other Actor', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '2',
      type: 'ue5CastNode',
      position: { x: 350, y: 200 },
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
      position: { x: 650, y: 150 },
      data: {
        label: 'Array Contains',
        subtitle: 'RecentlyTeleported',
        category: 'ARRAY',
        isPure: true,
        inputs: [
          { name: 'Target Array', type: 'object', value: 'RecentlyTeleported', connected: false },
          { name: 'Item to Find', type: 'object', connected: true }
        ],
        outputs: [
          { name: 'Return Value', type: 'boolean', connected: true }
        ]
      }
    },
    {
      id: '4',
      type: 'ue5Function',
      position: { x: 850, y: 200 },
      data: {
        label: 'NOT',
        category: 'MATH',
        isPure: true,
        inputs: [
          { name: 'Boolean', type: 'boolean', connected: true }
        ],
        outputs: [
          { name: 'Return Value', type: 'boolean', connected: true }
        ]
      }
    },
    {
      id: '5',
      type: 'ue5Branch',
      position: { x: 1050, y: 200 },
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
      position: { x: 1300, y: 150 },
      data: {
        label: 'Teleport Character',
        category: 'TELEPORT',
        isPure: false,
        execInConnected: true,
        execOutConnected: false,
        inputs: [
          { name: 'Character', type: 'object', connected: true },
          { name: 'Destination', type: 'transform', value: 'LinkedPortal Transform', connected: false },
          { name: 'Maintain Velocity', type: 'boolean', value: true, connected: false }
        ],
        outputs: []
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
      targetHandle: 'object-in',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e3',
      source: '2',
      target: '5',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e4',
      source: '2',
      target: '3',
      sourceHandle: 'as-character',
      targetHandle: 'Item to Find',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e5',
      source: '3',
      target: '4',
      sourceHandle: 'Return Value',
      targetHandle: 'Boolean',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e6',
      source: '4',
      target: '5',
      sourceHandle: 'Return Value',
      targetHandle: 'condition',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e7',
      source: '5',
      target: '6',
      sourceHandle: 'true',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e8',
      source: '2',
      target: '6',
      sourceHandle: 'as-character',
      targetHandle: 'Character',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    }
  ]

  // Smart Layout 적용
  const layoutedElements = useMemo(() => {
    return getSmartLayout(initialNodes, initialEdges)
  }, [])

  const [nodes, setNodes] = useState(layoutedElements.nodes)
  const [edges, setEdges] = useState(layoutedElements.edges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '400px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
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
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}

// Checkpoint Blueprint - 체크포인트 활성화
export function CheckpointBlueprint() {
  const initialNodes: Node[] = [
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
      type: 'ue5CastNode',
      position: { x: 350, y: 200 },
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
      type: 'ue5Get',
      position: { x: 400, y: 350 },
      data: {
        label: 'bIsActivated',
        varType: 'boolean',
        connected: true
      }
    },
    {
      id: '4',
      type: 'ue5Function',
      position: { x: 550, y: 350 },
      data: {
        label: 'NOT',
        category: 'MATH',
        isPure: true,
        inputs: [
          { name: 'Boolean', type: 'boolean', connected: true }
        ],
        outputs: [
          { name: 'Return Value', type: 'boolean', connected: true }
        ]
      }
    },
    {
      id: '5',
      type: 'ue5Branch',
      position: { x: 700, y: 200 },
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
      position: { x: 950, y: 150 },
      data: {
        label: 'Set Player Checkpoint',
        subtitle: 'Game Mode',
        category: 'CHECKPOINT',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'Player', type: 'object', connected: true },
          { name: 'Checkpoint', type: 'object', value: 'Self', connected: false }
        ],
        outputs: []
      }
    },
    {
      id: '7',
      type: 'ue5Set',
      position: { x: 1250, y: 150 },
      data: {
        label: 'bIsActivated',
        varType: 'boolean',
        value: 'True',
        execInConnected: true,
        execOutConnected: true,
        inputConnected: false
      }
    },
    {
      id: '8',
      type: 'ue5Function',
      position: { x: 1500, y: 150 },
      data: {
        label: 'Update Visual State',
        category: 'VISUAL',
        isPure: false,
        execInConnected: true,
        execOutConnected: false,
        inputs: [
          { name: 'Active Color', type: 'vector', value: '(0,1,0)', connected: false }
        ],
        outputs: []
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
      targetHandle: 'object-in',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e3',
      source: '2',
      target: '5',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e4',
      source: '3',
      target: '4',
      sourceHandle: 'value',
      targetHandle: 'Boolean',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e5',
      source: '4',
      target: '5',
      sourceHandle: 'Return Value',
      targetHandle: 'condition',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e6',
      source: '5',
      target: '6',
      sourceHandle: 'true',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e7',
      source: '2',
      target: '6',
      sourceHandle: 'as-character',
      targetHandle: 'Player',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e8',
      source: '6',
      target: '7',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e9',
      source: '7',
      target: '8',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    }
  ]

  // Smart Layout 적용
  const layoutedElements = useMemo(() => {
    return getSmartLayout(initialNodes, initialEdges)
  }, [])

  const [nodes, setNodes] = useState(layoutedElements.nodes)
  const [edges, setEdges] = useState(layoutedElements.edges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '450px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
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
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}

// Respawn System Blueprint - 리스폰 시스템
export function RespawnSystemBlueprint() {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 200 },
      data: { 
        label: 'Respawn Player',
        subtitle: 'Custom Event',
        execConnected: true,
        outputs: [
          { name: 'Player Controller', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '2',
      type: 'ue5Function',
      position: { x: 350, y: 150 },
      data: {
        label: 'Get Last Checkpoint',
        category: 'CHECKPOINT',
        isPure: true,
        inputs: [
          { name: 'Player Controller', type: 'object', connected: true }
        ],
        outputs: [
          { name: 'Checkpoint', type: 'object', connected: true },
          { name: 'Found', type: 'boolean', connected: true }
        ]
      }
    },
    {
      id: '3',
      type: 'ue5Branch',
      position: { x: 650, y: 200 },
      data: {
        execInConnected: true,
        conditionConnected: true,
        trueConnected: true,
        falseConnected: true
      }
    },
    {
      id: '4',
      type: 'ue5Function',
      position: { x: 900, y: 100 },
      data: {
        label: 'Get Respawn Transform',
        category: 'TRANSFORM',
        isPure: true,
        inputs: [
          { name: 'Checkpoint', type: 'object', connected: true }
        ],
        outputs: [
          { name: 'Transform', type: 'transform', connected: true }
        ]
      }
    },
    {
      id: '5',
      type: 'ue5Get',
      position: { x: 900, y: 300 },
      data: {
        label: 'DefaultSpawnTransform',
        varType: 'transform',
        connected: true
      }
    },
    {
      id: '6',
      type: 'ue5Function',
      position: { x: 1200, y: 200 },
      data: {
        label: 'Spawn Actor from Class',
        category: 'GAMEPLAY',
        isPure: false,
        execInConnected: true,
        execOutConnected: false,
        inputs: [
          { name: 'Class', type: 'class', value: 'BP_PlayerCharacter', connected: false },
          { name: 'Spawn Transform', type: 'transform', connected: true },
          { name: 'Collision Handling', type: 'enum', value: 'Adjust if Possible', connected: false }
        ],
        outputs: [
          { name: 'Return Value', type: 'object', connected: false }
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
      source: '1',
      target: '2',
      sourceHandle: 'Player Controller',
      targetHandle: 'Player Controller',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e3',
      source: '2',
      target: '3',
      sourceHandle: 'Found',
      targetHandle: 'condition',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.boolean }
    },
    {
      id: 'e4',
      source: '2',
      target: '4',
      sourceHandle: 'Checkpoint',
      targetHandle: 'Checkpoint',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.object }
    },
    {
      id: 'e5',
      source: '3',
      target: '6',
      sourceHandle: 'true',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e6',
      source: '3',
      target: '6',
      sourceHandle: 'false',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e7',
      source: '4',
      target: '6',
      sourceHandle: 'Transform',
      targetHandle: 'Spawn Transform',
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: DataTypeColors.vector }
    }
  ]

  // Smart Layout 적용
  const layoutedElements = useMemo(() => {
    return getSmartLayout(initialNodes, initialEdges)
  }, [])

  const [nodes, setNodes] = useState(layoutedElements.nodes)
  const [edges, setEdges] = useState(layoutedElements.edges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '400px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
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
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}