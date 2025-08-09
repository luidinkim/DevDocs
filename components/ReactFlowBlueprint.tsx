'use client'

import React, { useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
  Handle,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'

// 커스텀 노드 타입
const BlueprintNode = ({ data }: any) => {
  return (
    <div style={{
      background: '#1e293b',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '8px',
      border: '2px solid #3b82f6',
      minWidth: '150px'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#3b82f6' }} />
      <div style={{ fontSize: '12px', opacity: 0.7 }}>{data.type}</div>
      <div style={{ fontWeight: 'bold', marginTop: '4px' }}>{data.label}</div>
      {data.value && (
        <div style={{ fontSize: '11px', marginTop: '4px', color: '#94a3b8' }}>
          Value: {data.value}
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ background: '#3b82f6' }} />
    </div>
  )
}

const nodeTypes = { blueprint: BlueprintNode }

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'blueprint',
    position: { x: 50, y: 50 },
    data: { label: 'Begin Play', type: 'Event' }
  },
  {
    id: '2',
    type: 'blueprint',
    position: { x: 250, y: 50 },
    data: { label: 'Print String', type: 'Function', value: 'Hello Blueprint!' }
  },
  {
    id: '3',
    type: 'blueprint',
    position: { x: 250, y: 150 },
    data: { label: 'Get Player', type: 'Function' }
  },
  {
    id: '4',
    type: 'blueprint',
    position: { x: 450, y: 150 },
    data: { label: 'Set Health', type: 'Function', value: '100' }
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
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 }
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 }
  }
]

export default function ReactFlowBlueprint() {
  const [nodes, setNodes] = React.useState(initialNodes)
  const [edges, setEdges] = React.useState(initialEdges)

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
    <div style={{ width: '100%', height: '500px', background: '#0f172a', borderRadius: '8px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#1e293b" gap={20} />
        <Controls 
          style={{
            background: '#1e293b',
            border: '1px solid #334155'
          }}
        />
      </ReactFlow>
    </div>
  )
}