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
  NodeChange,
  EdgeChange,
  ConnectionMode,
  Panel,
  MarkerType,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ue5NodeTypes, DataTypeColors } from './UE5BlueprintNodes'
import { getLayoutedElements, getSmartLayout, getHierarchicalLayout } from './UE5BlueprintLayout'

// 기본 엣지 스타일
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

// Game Mode Start Game 블루프린트
function GameModeStartGameInner() {
  const reactFlowInstance = useReactFlow()
  
  const nodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 200 },
      data: { 
        label: 'StartGame',
        subtitle: 'Custom Event',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Set',
      position: { x: 300, y: 100 },
      data: { 
        label: 'IsGameActive',
        varType: 'boolean',
        value: 'True',
        execInConnected: true,
        execOutConnected: true
      }
    },
    {
      id: '3',
      type: 'ue5Set',
      position: { x: 500, y: 100 },
      data: { 
        label: 'CurrentGameTime',
        varType: 'float',
        value: '0.0',
        execInConnected: true,
        execOutConnected: true
      }
    },
    {
      id: '4',
      type: 'ue5Function',
      position: { x: 700, y: 100 },
      data: { 
        label: 'Reset All Coins',
        category: 'CUSTOM',
        isPure: false,
        execInConnected: true,
        execOutConnected: true
      }
    },
    {
      id: '5',
      type: 'ue5Function',
      position: { x: 900, y: 100 },
      data: { 
        label: 'Spawn Player at Start Zone',
        category: 'SPAWN',
        isPure: false,
        execInConnected: true,
        execOutConnected: true
      }
    },
    {
      id: '6',
      type: 'ue5Function',
      position: { x: 1150, y: 100 },
      data: { 
        label: 'Set Timer by Event',
        category: 'TIME',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'Event', type: 'delegate', value: 'UpdateGameTime' },
          { name: 'Time', type: 'float', value: '0.1' },
          { name: 'Looping', type: 'boolean', value: 'True' }
        ]
      }
    },
    {
      id: '7',
      type: 'ue5Function',
      position: { x: 1400, y: 100 },
      data: { 
        label: 'Update HUD',
        subtitle: 'Game Started',
        category: 'UI',
        isPure: false,
        execInConnected: true
      }
    }
  ]

  const edges: Edge[] = [
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
      source: '2',
      target: '3',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e3',
      source: '3',
      target: '4',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e4',
      source: '4',
      target: '5',
      sourceHandle: 'exec-out',
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
      source: '6',
      target: '7',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    }
  ]

  const { nodes: layoutedNodes, edges: layoutedEdges } = getSmartLayout(nodes, edges)
  
  const [nodesState, setNodes] = useState(layoutedNodes)
  const [edgesState, setEdges] = useState(layoutedEdges)
  const [selectedLayout, setSelectedLayout] = useState('smart')
  
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
      
      window.requestAnimationFrame(() => {
        reactFlowInstance.fitView({ padding: 0.2 })
      })
    },
    [nodesState, edgesState, reactFlowInstance]
  )
  
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
      height: '400px', 
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
              Smart Layout
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export function GameModeStartGame() {
  return (
    <ReactFlowProvider>
      <GameModeStartGameInner />
    </ReactFlowProvider>
  )
}

// Coin Collection 블루프린트
function CoinCollectionInner() {
  const reactFlowInstance = useReactFlow()
  
  const nodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 200 },
      data: { 
        label: 'OnCoinCollected',
        subtitle: 'Function',
        execConnected: true,
        outputs: [
          { name: 'PlayerState', type: 'object', connected: true },
          { name: 'CoinValue', type: 'integer', connected: true }
        ]
      }
    },
    {
      id: '2',
      type: 'ue5Function',
      position: { x: 350, y: 100 },
      data: { 
        label: 'Increment Coins Collected',
        category: 'MATH',
        isPure: false,
        execInConnected: true,
        execOutConnected: true
      }
    },
    {
      id: '3',
      type: 'ue5Function',
      position: { x: 350, y: 250 },
      data: { 
        label: 'Get Player Score from Map',
        category: 'MAP',
        isPure: true,
        inputs: [
          { name: 'PlayerState', type: 'object', connected: true }
        ],
        outputs: [
          { name: 'Score', type: 'integer', connected: true }
        ]
      }
    },
    {
      id: '4',
      type: 'ue5Function',
      position: { x: 600, y: 200 },
      data: { 
        label: 'Add',
        category: 'MATH',
        isPure: true,
        inputs: [
          { name: 'A', type: 'integer', connected: true },
          { name: 'B', type: 'integer', connected: true }
        ],
        outputs: [
          { name: 'Result', type: 'integer', connected: true }
        ]
      }
    },
    {
      id: '5',
      type: 'ue5Function',
      position: { x: 850, y: 100 },
      data: { 
        label: 'Update Map with New Score',
        category: 'MAP',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'PlayerState', type: 'object', connected: true },
          { name: 'Score', type: 'integer', connected: true }
        ]
      }
    },
    {
      id: '6',
      type: 'ue5Function',
      position: { x: 1100, y: 100 },
      data: { 
        label: 'Update HUD',
        category: 'UI',
        isPure: false,
        execInConnected: true,
        execOutConnected: true
      }
    },
    {
      id: '7',
      type: 'ue5Function',
      position: { x: 1300, y: 100 },
      data: { 
        label: 'Check Achievement Progress',
        category: 'ACHIEVEMENT',
        isPure: false,
        execInConnected: true
      }
    }
  ]

  const edges: Edge[] = [
    // Execution flow
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
      source: '2',
      target: '5',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e3',
      source: '5',
      target: '6',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e4',
      source: '6',
      target: '7',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    // Data flow
    {
      id: 'e5',
      source: '1',
      target: '3',
      sourceHandle: 'output-0',
      targetHandle: 'input-0',
      ...getEdgeStyle('object')
    },
    {
      id: 'e6',
      source: '1',
      target: '4',
      sourceHandle: 'output-1',
      targetHandle: 'input-1',
      ...getEdgeStyle('integer')
    },
    {
      id: 'e7',
      source: '3',
      target: '4',
      sourceHandle: 'output-0',
      targetHandle: 'input-0',
      ...getEdgeStyle('integer')
    },
    {
      id: 'e8',
      source: '4',
      target: '5',
      sourceHandle: 'output-0',
      targetHandle: 'input-1',
      ...getEdgeStyle('integer')
    },
    {
      id: 'e9',
      source: '1',
      target: '5',
      sourceHandle: 'output-0',
      targetHandle: 'input-0',
      ...getEdgeStyle('object')
    }
  ]

  const { nodes: layoutedNodes, edges: layoutedEdges } = getHierarchicalLayout(nodes, edges)
  
  const [nodesState, setNodes] = useState(layoutedNodes)
  const [edgesState, setEdges] = useState(layoutedEdges)
  
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
      height: '450px', 
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
            if (node.type === 'ue5Function') return '#1a1a1a'
            return '#2a2a2a'
          }}
        />
      </ReactFlow>
    </div>
  )
}

export function CoinCollection() {
  return (
    <ReactFlowProvider>
      <CoinCollectionInner />
    </ReactFlowProvider>
  )
}

// Player Controller Input 블루프린트
function PlayerControllerInputInner() {
  const reactFlowInstance = useReactFlow()
  
  const nodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 150 },
      data: { 
        label: 'IA_Jump',
        subtitle: 'Enhanced Input Action',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Function',
      position: { x: 300, y: 50 },
      data: { 
        label: 'Can Player Jump?',
        category: 'PLAYER',
        isPure: true,
        outputs: [
          { name: 'Result', type: 'boolean', connected: true }
        ]
      }
    },
    {
      id: '3',
      type: 'ue5Branch',
      position: { x: 450, y: 150 },
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
      position: { x: 700, y: 100 },
      data: { 
        label: 'Character->Jump',
        category: 'CHARACTER',
        isPure: false,
        execInConnected: true,
        execOutConnected: true
      }
    },
    {
      id: '5',
      type: 'ue5Function',
      position: { x: 700, y: 200 },
      data: { 
        label: 'Play Denied Sound',
        category: 'AUDIO',
        isPure: false,
        execInConnected: true,
        execOutConnected: true
      }
    },
    {
      id: '6',
      type: 'ue5Function',
      position: { x: 950, y: 100 },
      data: { 
        label: 'Update Jump Count',
        category: 'STATS',
        isPure: false,
        execInConnected: true
      }
    }
  ]

  const edges: Edge[] = [
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
      sourceHandle: 'output-0',
      targetHandle: 'condition',
      ...getEdgeStyle('boolean')
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
      source: '3',
      target: '5',
      sourceHandle: 'false',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e5',
      source: '4',
      target: '6',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    }
  ]

  const { nodes: layoutedNodes, edges: layoutedEdges } = getSmartLayout(nodes, edges)
  
  const [nodesState, setNodes] = useState(layoutedNodes)
  const [edgesState, setEdges] = useState(layoutedEdges)
  
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
      height: '350px', 
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
      </ReactFlow>
    </div>
  )
}

export function PlayerControllerInput() {
  return (
    <ReactFlowProvider>
      <PlayerControllerInputInner />
    </ReactFlowProvider>
  )
}

// Save Game 블루프린트
function SaveGameDataInner() {
  const reactFlowInstance = useReactFlow()
  
  const nodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 200 },
      data: { 
        label: 'SaveGameData',
        subtitle: 'Function',
        execConnected: true
      }
    },
    {
      id: '2',
      type: 'ue5Function',
      position: { x: 300, y: 200 },
      data: { 
        label: 'Create Save Game Object',
        category: 'SAVE GAME',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        outputs: [
          { name: 'Save Object', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '3',
      type: 'ue5Function',
      position: { x: 550, y: 200 },
      data: { 
        label: 'Set Best Time',
        category: 'SAVE DATA',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'Save Object', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '4',
      type: 'ue5Function',
      position: { x: 750, y: 200 },
      data: { 
        label: 'Set Total Coins',
        category: 'SAVE DATA',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'Save Object', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '5',
      type: 'ue5Function',
      position: { x: 950, y: 200 },
      data: { 
        label: 'Set Unlocked Levels',
        category: 'SAVE DATA',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'Save Object', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '6',
      type: 'ue5Function',
      position: { x: 1150, y: 200 },
      data: { 
        label: 'Save Game to Slot',
        category: 'SAVE GAME',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        inputs: [
          { name: 'Save Object', type: 'object', connected: true },
          { name: 'Slot Name', type: 'string', value: 'JumpMapSave' },
          { name: 'User Index', type: 'integer', value: '0' }
        ]
      }
    },
    {
      id: '7',
      type: 'ue5Function',
      position: { x: 1400, y: 200 },
      data: { 
        label: 'Print String',
        category: 'DEBUG',
        isPure: false,
        execInConnected: true,
        inputs: [
          { name: 'String', type: 'string', value: 'Game Saved Successfully' }
        ]
      }
    }
  ]

  const edges: Edge[] = [
    // Execution flow
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
      source: '2',
      target: '3',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e3',
      source: '3',
      target: '4',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e4',
      source: '4',
      target: '5',
      sourceHandle: 'exec-out',
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
      source: '6',
      target: '7',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    // Data flow - Save Object connections
    {
      id: 'e7',
      source: '2',
      target: '3',
      sourceHandle: 'output-0',
      targetHandle: 'input-0',
      ...getEdgeStyle('object')
    },
    {
      id: 'e8',
      source: '2',
      target: '4',
      sourceHandle: 'output-0',
      targetHandle: 'input-0',
      ...getEdgeStyle('object')
    },
    {
      id: 'e9',
      source: '2',
      target: '5',
      sourceHandle: 'output-0',
      targetHandle: 'input-0',
      ...getEdgeStyle('object')
    },
    {
      id: 'e10',
      source: '2',
      target: '6',
      sourceHandle: 'output-0',
      targetHandle: 'input-0',
      ...getEdgeStyle('object')
    }
  ]

  const { nodes: layoutedNodes, edges: layoutedEdges } = getSmartLayout(nodes, edges)
  
  const [nodesState, setNodes] = useState(layoutedNodes)
  const [edgesState, setEdges] = useState(layoutedEdges)
  
  useLayoutEffect(() => {
    reactFlowInstance.fitView({ padding: 0.15 })
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
      height: '400px', 
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
        fitViewOptions={{ padding: 0.15 }}
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

export function SaveGameData() {
  return (
    <ReactFlowProvider>
      <SaveGameDataInner />
    </ReactFlowProvider>
  )
}

// Start Zone 블루프린트
function StartZoneBlueprintInner() {
  const reactFlowInstance = useReactFlow()
  
  const nodes: Node[] = [
    {
      id: '1',
      type: 'ue5Event',
      position: { x: 50, y: 200 },
      data: { 
        label: 'On Component Begin Overlap',
        subtitle: 'BoxCollision',
        execConnected: true,
        outputs: [
          { name: 'Other Actor', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '2',
      type: 'ue5Cast',
      position: { x: 350, y: 200 },
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
      position: { x: 600, y: 200 },
      data: { 
        label: 'Get Game Mode',
        category: 'GAME',
        isPure: false,
        execInConnected: true,
        execOutConnected: true,
        outputs: [
          { name: 'Game Mode', type: 'object', connected: true }
        ]
      }
    },
    {
      id: '4',
      type: 'ue5Cast',
      position: { x: 850, y: 200 },
      data: { 
        targetClass: 'BP_JumpMapGameMode',
        execInConnected: true,
        execOutConnected: true,
        objectConnected: true,
        castOutConnected: true
      }
    },
    {
      id: '5',
      type: 'ue5Function',
      position: { x: 1100, y: 100 },
      data: { 
        label: 'Check if Game Not Started',
        category: 'GAME',
        isPure: true,
        inputs: [
          { name: 'Game Mode', type: 'object', connected: true }
        ],
        outputs: [
          { name: 'Not Started', type: 'boolean', connected: true }
        ]
      }
    },
    {
      id: '6',
      type: 'ue5Branch',
      position: { x: 1300, y: 200 },
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
      position: { x: 1500, y: 200 },
      data: { 
        label: 'Start Game Sequence',
        category: 'GAME',
        isPure: false,
        execInConnected: true,
        inputs: [
          { name: 'Game Mode', type: 'object', connected: true }
        ]
      }
    }
  ]

  const edges: Edge[] = [
    // Execution flow
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
      source: '2',
      target: '3',
      sourceHandle: 'exec-out',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    {
      id: 'e3',
      source: '3',
      target: '4',
      sourceHandle: 'exec-out',
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
      source: '6',
      target: '7',
      sourceHandle: 'true',
      targetHandle: 'exec-in',
      ...defaultEdgeOptions
    },
    // Data flow
    {
      id: 'e6',
      source: '1',
      target: '2',
      sourceHandle: 'output-0',
      targetHandle: 'object-in',
      ...getEdgeStyle('object')
    },
    {
      id: 'e7',
      source: '3',
      target: '4',
      sourceHandle: 'output-0',
      targetHandle: 'object-in',
      ...getEdgeStyle('object')
    },
    {
      id: 'e8',
      source: '4',
      target: '5',
      sourceHandle: 'cast-out',
      targetHandle: 'input-0',
      ...getEdgeStyle('object')
    },
    {
      id: 'e9',
      source: '5',
      target: '6',
      sourceHandle: 'output-0',
      targetHandle: 'condition',
      ...getEdgeStyle('boolean')
    },
    {
      id: 'e10',
      source: '4',
      target: '7',
      sourceHandle: 'cast-out',
      targetHandle: 'input-0',
      ...getEdgeStyle('object')
    }
  ]

  const { nodes: layoutedNodes, edges: layoutedEdges } = getHierarchicalLayout(nodes, edges)
  
  const [nodesState, setNodes] = useState(layoutedNodes)
  const [edgesState, setEdges] = useState(layoutedEdges)
  
  useLayoutEffect(() => {
    reactFlowInstance.fitView({ padding: 0.15 })
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
      height: '450px', 
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
        fitViewOptions={{ padding: 0.15 }}
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
            if (node.type === 'ue5Cast') return '#2b3d5f'
            if (node.type === 'ue5Branch') return '#8b5a00'
            return '#1a1a1a'
          }}
        />
      </ReactFlow>
    </div>
  )
}

export function StartZoneBlueprint() {
  return (
    <ReactFlowProvider>
      <StartZoneBlueprintInner />
    </ReactFlowProvider>
  )
}