import dagre from 'dagre'
import { Node, Edge, Position } from 'reactflow'

// dagre 레이아웃 옵션
const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

// 레이아웃 방향 옵션
export type LayoutDirection = 'TB' | 'BT' | 'LR' | 'RL'

// UE5 블루프린트 스타일 레이아웃 설정
const getLayoutOptions = (direction: LayoutDirection = 'LR') => ({
  rankdir: direction,  // LR: 왼쪽에서 오른쪽 (블루프린트 기본)
  align: 'UL',        // 노드 정렬 방식
  nodesep: 100,       // 같은 랭크 내 노드 간 거리 (위아래)
  edgesep: 50,        // 엣지 간 최소 거리
  ranksep: 200,       // 랭크 간 거리 (좌우)
  marginx: 50,        // 그래프 여백
  marginy: 50,
  acyclicer: 'greedy', // 순환 제거 알고리즘
  ranker: 'network-simplex' // 랭킹 알고리즘
})

// 노드와 엣지를 자동으로 배치하는 함수
export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: LayoutDirection = 'LR'
) => {
  const isHorizontal = direction === 'LR' || direction === 'RL'
  
  // dagre 그래프 초기화
  dagreGraph.setGraph(getLayoutOptions(direction))
  
  // 노드 추가 - 크기 고려
  nodes.forEach((node) => {
    // 노드 타입별 기본 크기 설정
    let width = 240
    let height = 120
    
    switch(node.type) {
      case 'ue5Event':
        width = 220
        height = 100
        break
      case 'ue5Function':
        // inputs/outputs 개수에 따라 높이 동적 조정
        const inputs = node.data?.inputs?.length || 0
        const outputs = node.data?.outputs?.length || 0
        height = 120 + Math.max(inputs, outputs) * 30
        width = 260
        break
      case 'ue5Get':
        width = 180
        height = 80
        break
      case 'ue5Set':
        width = 220
        height = 140
        break
      case 'ue5Branch':
        width = 200
        height = 160
        break
    }
    
    dagreGraph.setNode(node.id, { 
      width, 
      height,
      // 노드별 우선순위 설정 (Event 노드를 왼쪽에)
      rank: node.type === 'ue5Event' ? 'min' : undefined
    })
  })
  
  // 엣지 추가 - 실행 흐름 우선순위
  edges.forEach((edge) => {
    // 실행 흐름 엣지에 가중치 부여
    const isExecution = edge.sourceHandle?.includes('exec') || 
                       edge.targetHandle?.includes('exec')
    
    dagreGraph.setEdge(edge.source, edge.target, {
      weight: isExecution ? 10 : 1,  // 실행 흐름에 높은 가중치
      minlen: isExecution ? 2 : 1    // 최소 랭크 거리
    })
  })
  
  // 레이아웃 계산
  dagre.layout(dagreGraph)
  
  // 계산된 위치로 노드 업데이트
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    
    // 핸들 위치 설정 (레이아웃 방향에 따라)
    const targetPosition = isHorizontal ? Position.Left : Position.Top
    const sourcePosition = isHorizontal ? Position.Right : Position.Bottom
    
    return {
      ...node,
      targetPosition,
      sourcePosition,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2
      }
    }
  })
  
  return { nodes: layoutedNodes, edges }
}

// 계층적 레이아웃 (Event → Functions → Outputs)
export const getHierarchicalLayout = (
  nodes: Node[],
  edges: Edge[]
) => {
  // 노드를 타입별로 분류
  const eventNodes = nodes.filter(n => n.type === 'ue5Event')
  const getNodes = nodes.filter(n => n.type === 'ue5Get')
  const setNodes = nodes.filter(n => n.type === 'ue5Set')
  const functionNodes = nodes.filter(n => n.type === 'ue5Function')
  const branchNodes = nodes.filter(n => n.type === 'ue5Branch')
  
  // 각 노드의 깊이(depth) 계산
  const nodeDepths = new Map<string, number>()
  
  // Event 노드는 깊이 0
  eventNodes.forEach(node => {
    nodeDepths.set(node.id, 0)
  })
  
  // BFS로 깊이 계산
  const queue = [...eventNodes.map(n => n.id)]
  const visited = new Set<string>()
  
  while (queue.length > 0) {
    const currentId = queue.shift()!
    if (visited.has(currentId)) continue
    visited.add(currentId)
    
    const currentDepth = nodeDepths.get(currentId) || 0
    
    // 연결된 노드들의 깊이 설정
    edges
      .filter(e => e.source === currentId)
      .forEach(edge => {
        const targetNode = nodes.find(n => n.id === edge.target)
        if (targetNode) {
          const existingDepth = nodeDepths.get(edge.target)
          const newDepth = currentDepth + 1
          
          if (existingDepth === undefined || newDepth > existingDepth) {
            nodeDepths.set(edge.target, newDepth)
          }
          
          if (!visited.has(edge.target)) {
            queue.push(edge.target)
          }
        }
      })
  }
  
  // 깊이별로 노드 그룹화
  const depthGroups = new Map<number, Node[]>()
  nodes.forEach(node => {
    const depth = nodeDepths.get(node.id) || 0
    if (!depthGroups.has(depth)) {
      depthGroups.set(depth, [])
    }
    depthGroups.get(depth)!.push(node)
  })
  
  // 각 깊이별로 노드 배치
  const layoutedNodes: Node[] = []
  const xSpacing = 300  // 깊이 간 거리
  const ySpacing = 150  // 같은 깊이 내 노드 간 거리
  
  depthGroups.forEach((nodesAtDepth, depth) => {
    const x = depth * xSpacing + 50
    
    // 노드들을 타입별로 정렬 (Event → Get → Function → Set → Branch)
    nodesAtDepth.sort((a, b) => {
      const typeOrder = ['ue5Event', 'ue5Get', 'ue5Function', 'ue5Set', 'ue5Branch']
      return typeOrder.indexOf(a.type!) - typeOrder.indexOf(b.type!)
    })
    
    // Y 위치 계산 (중앙 정렬)
    const totalHeight = (nodesAtDepth.length - 1) * ySpacing
    const startY = (800 - totalHeight) / 2  // 캔버스 높이 800 기준
    
    nodesAtDepth.forEach((node, index) => {
      layoutedNodes.push({
        ...node,
        position: {
          x,
          y: startY + index * ySpacing
        },
        targetPosition: Position.Left,
        sourcePosition: Position.Right
      })
    })
  })
  
  return { nodes: layoutedNodes, edges }
}

// 원형 레이아웃 (중앙 노드 주변 배치)
export const getRadialLayout = (
  nodes: Node[],
  edges: Edge[],
  centerNodeId?: string
) => {
  if (nodes.length === 0) return { nodes, edges }
  
  // 중앙 노드 결정 (Event 노드 또는 지정된 노드)
  const centerNode = centerNodeId 
    ? nodes.find(n => n.id === centerNodeId)
    : nodes.find(n => n.type === 'ue5Event') || nodes[0]
  
  if (!centerNode) return { nodes, edges }
  
  const layoutedNodes: Node[] = []
  const radius = 300
  const centerX = 400
  const centerY = 400
  
  // 중앙 노드 배치
  layoutedNodes.push({
    ...centerNode,
    position: { x: centerX, y: centerY }
  })
  
  // 나머지 노드들을 원형으로 배치
  const otherNodes = nodes.filter(n => n.id !== centerNode.id)
  const angleStep = (2 * Math.PI) / otherNodes.length
  
  otherNodes.forEach((node, index) => {
    const angle = index * angleStep - Math.PI / 2  // 위쪽부터 시작
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    
    layoutedNodes.push({
      ...node,
      position: { x, y }
    })
  })
  
  return { nodes: layoutedNodes, edges }
}

// 스마트 레이아웃 (노드 관계 분석 후 최적 배치)
export const getSmartLayout = (
  nodes: Node[],
  edges: Edge[]
) => {
  // 실행 흐름과 데이터 흐름 분리
  const executionEdges = edges.filter(e => 
    e.sourceHandle?.includes('exec') || e.targetHandle?.includes('exec')
  )
  const dataEdges = edges.filter(e => 
    !e.sourceHandle?.includes('exec') && !e.targetHandle?.includes('exec')
  )
  
  // 메인 실행 경로 찾기
  const mainPath: string[] = []
  const eventNode = nodes.find(n => n.type === 'ue5Event')
  
  if (eventNode) {
    mainPath.push(eventNode.id)
    let currentNode = eventNode.id
    
    // 실행 경로 따라가기
    while (true) {
      const nextEdge = executionEdges.find(e => e.source === currentNode)
      if (!nextEdge) break
      
      mainPath.push(nextEdge.target)
      currentNode = nextEdge.target
    }
  }
  
  // 메인 경로 노드들을 수평으로 배치
  const layoutedNodes: Node[] = []
  const xSpacing = 350
  const mainY = 400
  
  mainPath.forEach((nodeId, index) => {
    const node = nodes.find(n => n.id === nodeId)
    if (node) {
      layoutedNodes.push({
        ...node,
        position: {
          x: 50 + index * xSpacing,
          y: mainY
        },
        targetPosition: Position.Left,
        sourcePosition: Position.Right
      })
    }
  })
  
  // 데이터 노드들을 메인 경로 위아래에 배치
  const dataNodes = nodes.filter(n => !mainPath.includes(n.id))
  let topOffset = 150
  let bottomOffset = 150
  
  dataNodes.forEach(node => {
    // 이 노드가 연결된 메인 경로 노드 찾기
    const connectedMainNode = edges.find(e => 
      (e.source === node.id && mainPath.includes(e.target)) ||
      (e.target === node.id && mainPath.includes(e.source))
    )
    
    if (connectedMainNode) {
      const mainNodeId = mainPath.includes(connectedMainNode.source) 
        ? connectedMainNode.source 
        : connectedMainNode.target
      const mainNodeIndex = mainPath.indexOf(mainNodeId)
      const mainNodeX = 50 + mainNodeIndex * xSpacing
      
      // GET 노드는 위에, SET 노드는 아래에
      if (node.type === 'ue5Get') {
        layoutedNodes.push({
          ...node,
          position: {
            x: mainNodeX,
            y: mainY - topOffset
          },
          targetPosition: Position.Left,
          sourcePosition: Position.Right
        })
        topOffset += 100
      } else {
        layoutedNodes.push({
          ...node,
          position: {
            x: mainNodeX,
            y: mainY + bottomOffset
          },
          targetPosition: Position.Left,
          sourcePosition: Position.Right
        })
        bottomOffset += 100
      }
    } else {
      // 연결되지 않은 노드는 오른쪽 끝에
      layoutedNodes.push({
        ...node,
        position: {
          x: 50 + mainPath.length * xSpacing,
          y: mainY + (topOffset - bottomOffset)
        },
        targetPosition: Position.Left,
        sourcePosition: Position.Right
      })
    }
  })
  
  return { nodes: layoutedNodes, edges }
}