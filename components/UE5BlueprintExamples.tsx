'use client'

import React, { useCallback, useState } from 'react'
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
  MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ue5NodeTypes, DataTypeColors } from './UE5BlueprintNodes'

// UE5 스타일 엣지
const defaultEdgeOptions = {
  animated: false,
  style: {
    strokeWidth: 3,
    stroke: '#ffffff'
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
    color: '#ffffff'
  }
}

// 데이터 타입별 엣지 스타일
const getEdgeStyle = (dataType: string) => ({
  animated: false,
  style: {
    strokeWidth: 2,
    stroke: DataTypeColors[dataType as keyof typeof DataTypeColors] || '#0088ff'
  }
})

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
      position: { x: 350, y: 130 },
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
    <div style={{ width: '100%', height: '400px', background: '#0f0f0f', borderRadius: '4px', border: '1px solid #333' }}>
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
        <Background color="#1a1a1a" gap={20} size={1} />
        <Controls style={{ button: { background: '#2a2a2a', color: '#fff' } }} />
      </ReactFlow>
    </div>
  )
}

// 2. 변수 Get/Set 예제
export function UE5VariableFlow() {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 200 },
      data: { 
        label: 'Event Tick',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Get',
      position: { x: 250, y: 100 },
      data: { 
        label: 'Player Health',
        varType: 'float',
        connected: true
      }
    },
    {
      id: '3',
      type: 'ue5Function',
      position: { x: 450, y: 80 },
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
      position: { x: 350, y: 220 },
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
      position: { x: 600, y: 200 },
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
      position: { x: 450, y: 350 },
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
      position: { x: 850, y: 180 },
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

  const [nodesState, setNodes] = useState(nodes)
  const [edgesState, setEdges] = useState(edges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  return (
    <div style={{ width: '100%', height: '500px', background: '#0f0f0f', borderRadius: '4px', border: '1px solid #333' }}>
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
        <Background color="#1a1a1a" gap={20} size={1} />
        <Controls style={{ button: { background: '#2a2a2a', color: '#fff' } }} />
        <MiniMap 
          style={{
            backgroundColor: '#0f0f0f',
            border: '1px solid #333'
          }}
          nodeColor={(node) => {
            if (node.type === 'ue5Event') return '#5b0000'
            if (node.type === 'ue5Get' || node.type === 'ue5Set') return '#2a2a2a'
            if (node.type === 'ue5Branch') return '#3a3a3a'
            return '#1a1a1a'
          }}
        />
      </ReactFlow>
    </div>
  )
}

// 3. 복잡한 게임 로직 예제
export function UE5ComplexGameLogic() {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 250 },
      data: { 
        label: 'Event OnDamage',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Get',
      position: { x: 200, y: 150 },
      data: { 
        label: 'Current Health',
        varType: 'float',
        connected: true
      }
    },
    {
      id: '3',
      type: 'ue5Get',
      position: { x: 200, y: 350 },
      data: { 
        label: 'Damage Amount',
        varType: 'float',
        connected: true
      }
    },
    {
      id: '4',
      type: 'ue5Function',
      position: { x: 400, y: 200 },
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
      position: { x: 600, y: 200 },
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
      position: { x: 350, y: 400 },
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
      position: { x: 600, y: 400 },
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
      position: { x: 450, y: 500 },
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
      position: { x: 850, y: 350 },
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
      position: { x: 850, y: 450 },
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
      position: { x: 650, y: 550 },
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

  const [nodesState, setNodes] = useState(nodes)
  const [edgesState, setEdges] = useState(edges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  return (
    <div style={{ width: '100%', height: '650px', background: '#0f0f0f', borderRadius: '4px', border: '1px solid #333' }}>
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
        <Background color="#1a1a1a" gap={20} size={1} />
        <Controls style={{ button: { background: '#2a2a2a', color: '#fff' } }} />
        <Panel position="top-left">
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '4px',
            padding: '8px',
            color: '#ccc',
            fontSize: '11px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Damage System</div>
            <div style={{ opacity: 0.7 }}>Health management with death handling</div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}