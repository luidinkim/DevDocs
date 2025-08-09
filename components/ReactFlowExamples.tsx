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
  Handle,
  Position,
  ConnectionMode,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'

// 언리얼 블루프린트 스타일 커스텀 노드
const BlueprintNode = ({ data, selected }: any) => {
  return (
    <div style={{
      background: selected ? '#2563eb' : '#1e293b',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      border: `2px solid ${selected ? '#60a5fa' : '#3b82f6'}`,
      minWidth: '150px',
      boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
      transition: 'all 0.2s'
    }}>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          background: '#10b981',
          width: '12px',
          height: '12px',
          border: '2px solid #0f172a'
        }} 
      />
      
      <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>
        {data.type || 'Function'}
      </div>
      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
        {data.label}
      </div>
      {data.value && (
        <div style={{ fontSize: '11px', marginTop: '4px', color: '#94a3b8' }}>
          {data.value}
        </div>
      )}
      
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid #0f172a'
        }} 
      />
    </div>
  )
}

// 이벤트 노드 (빨간색 헤더)
const EventNode = ({ data, selected }: any) => {
  return (
    <div style={{
      background: selected ? '#dc2626' : '#991b1b',
      color: 'white',
      borderRadius: '8px',
      border: `2px solid ${selected ? '#f87171' : '#dc2626'}`,
      minWidth: '150px',
      boxShadow: selected ? '0 0 0 2px rgba(220, 38, 38, 0.3)' : 'none',
      transition: 'all 0.2s'
    }}>
      <div style={{
        padding: '6px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        fontSize: '10px',
        fontWeight: 'bold'
      }}>
        EVENT
      </div>
      <div style={{ padding: '8px 12px', fontWeight: 'bold' }}>
        {data.label}
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#dc2626',
          width: '12px',
          height: '12px',
          border: '2px solid #0f172a'
        }} 
      />
    </div>
  )
}

// 변수 노드 (초록색)
const VariableNode = ({ data, selected }: any) => {
  return (
    <div style={{
      background: selected ? '#16a34a' : '#14532d',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      border: `2px solid ${selected ? '#4ade80' : '#16a34a'}`,
      minWidth: '120px',
      boxShadow: selected ? '0 0 0 2px rgba(22, 163, 74, 0.3)' : 'none',
      transition: 'all 0.2s'
    }}>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          background: '#16a34a',
          width: '12px',
          height: '12px',
          border: '2px solid #0f172a'
        }} 
      />
      
      <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>
        Variable
      </div>
      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
        {data.label}
      </div>
      <div style={{ fontSize: '12px', marginTop: '4px', color: '#bbf7d0' }}>
        {data.value || 'null'}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#16a34a',
          width: '12px',
          height: '12px',
          border: '2px solid #0f172a'
        }} 
      />
    </div>
  )
}

const nodeTypes = {
  blueprint: BlueprintNode,
  event: EventNode,
  variable: VariableNode
}

// 기본 블루프린트 예제
export function BasicBlueprint() {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'event',
      position: { x: 50, y: 100 },
      data: { label: 'Begin Play' }
    },
    {
      id: '2',
      type: 'blueprint',
      position: { x: 250, y: 100 },
      data: { label: 'Print String', type: 'Function', value: 'Hello World!' }
    },
    {
      id: '3',
      type: 'variable',
      position: { x: 250, y: 200 },
      data: { label: 'Player Health', value: '100' }
    },
    {
      id: '4',
      type: 'blueprint',
      position: { x: 450, y: 150 },
      data: { label: 'Set Health', type: 'Function' }
    }
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 }
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      animated: true,
      style: { stroke: '#16a34a', strokeWidth: 2 }
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
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 }
    }, eds)),
    []
  )

  return (
    <div style={{ width: '100%', height: '400px', background: '#0f172a', borderRadius: '8px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background color="#1e293b" gap={20} />
        <Controls />
        <MiniMap 
          style={{
            backgroundColor: '#0f172a'
          }}
          nodeColor="#1e293b"
        />
      </ReactFlow>
    </div>
  )
}

// 인터랙티브 블루프린트 예제
export function InteractiveBlueprint() {
  const [nodeId, setNodeId] = useState(5)
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      type: 'event',
      position: { x: 50, y: 150 },
      data: { label: 'On Click' }
    },
    {
      id: '2',
      type: 'blueprint',
      position: { x: 250, y: 150 },
      data: { label: 'Spawn Actor', type: 'Function' }
    }
  ])
  
  const [edges, setEdges] = useState<Edge[]>([
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      style: { stroke: '#dc2626', strokeWidth: 2 }
    }
  ])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 }
    }, eds)),
    []
  )

  const addNode = () => {
    const newNode: Node = {
      id: String(nodeId),
      type: 'blueprint',
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 200 + 50 
      },
      data: { 
        label: `New Node ${nodeId}`, 
        type: 'Function'
      }
    }
    setNodes((nds) => [...nds, newNode])
    setNodeId(nodeId + 1)
  }

  return (
    <div style={{ width: '100%', height: '400px', background: '#0f172a', borderRadius: '8px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background color="#1e293b" gap={20} />
        <Controls />
        <Panel position="top-right">
          <button
            onClick={addNode}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Add Node
          </button>
        </Panel>
      </ReactFlow>
    </div>
  )
}

// 복잡한 로직 플로우 예제
export function ComplexLogicFlow() {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'event',
      position: { x: 50, y: 200 },
      data: { label: 'Game Start' }
    },
    {
      id: '2',
      type: 'blueprint',
      position: { x: 200, y: 100 },
      data: { label: 'Initialize Player', type: 'Function' }
    },
    {
      id: '3',
      type: 'blueprint',
      position: { x: 200, y: 200 },
      data: { label: 'Load Level', type: 'Function' }
    },
    {
      id: '4',
      type: 'blueprint',
      position: { x: 200, y: 300 },
      data: { label: 'Setup UI', type: 'Function' }
    },
    {
      id: '5',
      type: 'variable',
      position: { x: 400, y: 100 },
      data: { label: 'Player', value: 'Object' }
    },
    {
      id: '6',
      type: 'variable',
      position: { x: 400, y: 200 },
      data: { label: 'Current Level', value: 'Level_01' }
    },
    {
      id: '7',
      type: 'blueprint',
      position: { x: 600, y: 200 },
      data: { label: 'Start Gameplay', type: 'Function' }
    }
  ]

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } },
    { id: 'e1-4', source: '1', target: '4', animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } },
    { id: 'e2-5', source: '2', target: '5', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { id: 'e3-6', source: '3', target: '6', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { id: 'e5-7', source: '5', target: '7', animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } },
    { id: 'e6-7', source: '6', target: '7', animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } },
    { id: 'e4-7', source: '4', target: '7', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }
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
    <div style={{ width: '100%', height: '500px', background: '#0f172a', borderRadius: '8px' }}>
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background color="#1e293b" gap={20} />
        <Controls />
        <MiniMap 
          style={{
            backgroundColor: '#0f172a'
          }}
          nodeColor={(node) => {
            if (node.type === 'event') return '#991b1b'
            if (node.type === 'variable') return '#14532d'
            return '#1e293b'
          }}
        />
      </ReactFlow>
    </div>
  )
}