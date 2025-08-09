'use client'

import React from 'react'
import { Handle, Position } from 'reactflow'

// UE5 Blueprint 데이터 타입별 색상
export const DataTypeColors = {
  exec: '#ffffff',        // 실행 흐름 (흰색)
  boolean: '#8b0000',     // Boolean (진한 빨강)
  byte: '#006b5e',        // Byte (진한 청록)
  integer: '#1fcb4a',     // Integer (청록/민트)
  float: '#a1fb4f',       // Float (연한 초록)
  string: '#ff0099',      // String (핑크/마젠타)
  text: '#ff66b3',        // Text (연한 핑크)
  vector: '#ffd800',      // Vector (금색/노랑)
  rotator: '#b7b7ff',     // Rotator (연한 보라)
  transform: '#ff6600',   // Transform (주황)
  object: '#0088ff',      // Object/Actor (파랑)
  class: '#5b00a8',       // Class (보라)
  struct: '#003f87',      // Struct (진한 파랑)
  array: '#a700ff',       // Array (보라)
  map: '#7d00ff',         // Map (진보라)
  set: '#00d4ff',         // Set (하늘색)
  delegate: '#ff3a3a',    // Delegate/Event (빨강)
  multicast: '#ff3a3a',   // Multicast Delegate (빨강)
}

// 핀 타입 인터페이스
interface PinData {
  name: string
  type: keyof typeof DataTypeColors
  isArray?: boolean
  value?: any
  connected?: boolean
}

// UE5 스타일 핀 컴포넌트
const BlueprintPin = ({ 
  type, 
  position, 
  id, 
  isConnected = false,
  isExecution = false 
}: {
  type: 'source' | 'target'
  position: Position
  id?: string
  isConnected?: boolean
  isExecution?: boolean
}) => {
  const pinColor = isExecution ? DataTypeColors.exec : DataTypeColors.object
  const pinShape = isExecution ? 'polygon' : 'circle'
  
  return (
    <Handle
      type={type}
      position={position}
      id={id}
      style={{
        width: isExecution ? '12px' : '14px',
        height: isExecution ? '12px' : '14px',
        background: isConnected ? pinColor : 'transparent',
        border: `2px solid ${pinColor}`,
        borderRadius: isExecution ? '0' : '50%',
        clipPath: isExecution ? 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)' : 'none',
        transform: isExecution ? 'rotate(90deg)' : 'none',
      }}
    />
  )
}

// UE5 Event Node (빨간색 헤더)
export const UE5EventNode = ({ data, selected }: any) => {
  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '4px',
      border: selected ? '2px solid #ffd700' : '1px solid #333',
      minWidth: '200px',
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    }}>
      {/* 헤더 - 빨간색 */}
      <div style={{
        background: 'linear-gradient(to bottom, #8b0000, #5b0000)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px 4px 0 0',
        fontSize: '11px',
        fontWeight: 'bold',
        borderBottom: '1px solid #300000'
      }}>
        EVENT
      </div>
      
      {/* 노드 제목 */}
      <div style={{
        padding: '6px 12px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '13px',
        borderBottom: '1px solid #333'
      }}>
        {data.label || 'Event Begin Play'}
      </div>
      
      {/* 출력 핀 */}
      <div style={{ padding: '8px 12px', position: 'relative' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          color: '#ccc',
          marginBottom: '4px'
        }}>
          <span style={{ marginRight: '20px' }}>exec</span>
          <BlueprintPin 
            type="source" 
            position={Position.Right} 
            id="exec"
            isExecution={true}
            isConnected={data.execConnected}
          />
        </div>
      </div>
    </div>
  )
}

// UE5 Function Node (파란색)
export const UE5FunctionNode = ({ data, selected }: any) => {
  const inputs = data.inputs || []
  const outputs = data.outputs || []
  
  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '4px',
      border: selected ? '2px solid #ffd700' : '1px solid #333',
      minWidth: '220px',
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    }}>
      {/* 헤더 - 파란색 (Pure Function은 초록색) */}
      <div style={{
        background: data.isPure 
          ? 'linear-gradient(to bottom, #006b3c, #004d2b)'
          : 'linear-gradient(to bottom, #003f87, #002654)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px 4px 0 0',
        fontSize: '11px',
        fontWeight: 'bold',
        borderBottom: data.isPure ? '1px solid #003020' : '1px solid #001a3a'
      }}>
        {data.category || 'FUNCTION'}
      </div>
      
      {/* 노드 제목 */}
      <div style={{
        padding: '6px 12px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '13px',
        borderBottom: '1px solid #333'
      }}>
        {data.label || 'Print String'}
      </div>
      
      {/* 입출력 핀 */}
      <div style={{ padding: '8px 0' }}>
        {/* Execution 핀 (impure functions only) */}
        {!data.isPure && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '0 12px',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
              <BlueprintPin 
                type="target" 
                position={Position.Left} 
                id="exec-in"
                isExecution={true}
                isConnected={data.execInConnected}
              />
              <span style={{ marginLeft: '8px' }}>exec</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
              <span style={{ marginRight: '8px' }}>then</span>
              <BlueprintPin 
                type="source" 
                position={Position.Right} 
                id="exec-out"
                isExecution={true}
                isConnected={data.execOutConnected}
              />
            </div>
          </div>
        )}
        
        {/* 데이터 입력 핀 */}
        {inputs.map((input: PinData, index: number) => (
          <div key={`input-${index}`} style={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: '2px 12px',
            minHeight: '24px'
          }}>
            <Handle
              type="target"
              position={Position.Left}
              id={`input-${input.name}`}
              style={{
                width: '14px',
                height: '14px',
                background: input.connected ? DataTypeColors[input.type] : 'transparent',
                border: `2px solid ${DataTypeColors[input.type]}`,
                borderRadius: '50%',
                position: 'absolute',
                left: '-7px'
              }}
            />
            <span style={{ 
              marginLeft: '20px', 
              color: DataTypeColors[input.type],
              fontSize: '11px'
            }}>
              {input.name}
            </span>
            {input.value !== undefined && !input.connected && (
              <input
                type="text"
                defaultValue={input.value}
                style={{
                  marginLeft: '8px',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '2px',
                  color: '#ccc',
                  padding: '2px 6px',
                  fontSize: '10px',
                  width: '80px'
                }}
              />
            )}
          </div>
        ))}
        
        {/* 데이터 출력 핀 */}
        {outputs.map((output: PinData, index: number) => (
          <div key={`output-${index}`} style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '2px 12px',
            minHeight: '24px'
          }}>
            <span style={{ 
              marginRight: '20px', 
              color: DataTypeColors[output.type],
              fontSize: '11px'
            }}>
              {output.name}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={`output-${output.name}`}
              style={{
                width: '14px',
                height: '14px',
                background: output.connected ? DataTypeColors[output.type] : 'transparent',
                border: `2px solid ${DataTypeColors[output.type]}`,
                borderRadius: '50%',
                position: 'absolute',
                right: '-7px'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// UE5 Variable GET Node
export const UE5GetNode = ({ data, selected }: any) => {
  const varType = data.varType || 'object'
  const varColor = DataTypeColors[varType as keyof typeof DataTypeColors]
  
  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '4px',
      border: selected ? '2px solid #ffd700' : '1px solid #333',
      minWidth: '150px',
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      {/* GET 인디케이터 */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: varColor,
        color: 'white',
        padding: '1px 4px',
        borderRadius: '2px',
        fontSize: '9px',
        fontWeight: 'bold'
      }}>
        GET
      </div>
      
      {/* 변수 이름 */}
      <div style={{
        padding: '12px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          width: '4px',
          height: '30px',
          background: varColor,
          marginRight: '8px',
          borderRadius: '2px'
        }} />
        {data.label || 'Variable'}
      </div>
      
      {/* 출력 핀 */}
      <Handle
        type="source"
        position={Position.Right}
        id="value"
        style={{
          width: '14px',
          height: '14px',
          background: data.connected ? varColor : 'transparent',
          border: `2px solid ${varColor}`,
          borderRadius: '50%',
          right: '-7px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  )
}

// UE5 Variable SET Node
export const UE5SetNode = ({ data, selected }: any) => {
  const varType = data.varType || 'object'
  const varColor = DataTypeColors[varType as keyof typeof DataTypeColors]
  
  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '4px',
      border: selected ? '2px solid #ffd700' : '1px solid #333',
      minWidth: '180px',
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      {/* SET 인디케이터 */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: varColor,
        color: 'white',
        padding: '1px 4px',
        borderRadius: '2px',
        fontSize: '9px',
        fontWeight: 'bold'
      }}>
        SET
      </div>
      
      {/* 변수 이름 */}
      <div style={{
        padding: '8px 12px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '13px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          width: '4px',
          height: '20px',
          background: varColor,
          marginRight: '8px',
          borderRadius: '2px'
        }} />
        {data.label || 'Variable'}
      </div>
      
      {/* 핀들 */}
      <div style={{ padding: '8px 0' }}>
        {/* Execution 핀 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '0 12px',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
            <BlueprintPin 
              type="target" 
              position={Position.Left} 
              id="exec-in"
              isExecution={true}
              isConnected={data.execInConnected}
            />
            <span style={{ marginLeft: '8px', fontSize: '11px' }}>exec</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
            <span style={{ marginRight: '8px', fontSize: '11px' }}>exec</span>
            <BlueprintPin 
              type="source" 
              position={Position.Right} 
              id="exec-out"
              isExecution={true}
              isConnected={data.execOutConnected}
            />
          </div>
        </div>
        
        {/* 값 입력/출력 핀 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '0 12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Handle
              type="target"
              position={Position.Left}
              id="value-in"
              style={{
                width: '14px',
                height: '14px',
                background: data.valueInConnected ? varColor : 'transparent',
                border: `2px solid ${varColor}`,
                borderRadius: '50%',
                position: 'absolute',
                left: '-7px'
              }}
            />
            <span style={{ 
              marginLeft: '20px', 
              color: varColor,
              fontSize: '11px'
            }}>
              {data.label || 'Value'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              marginRight: '20px', 
              color: varColor,
              fontSize: '11px'
            }}>
              {data.label || 'Value'}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id="value-out"
              style={{
                width: '14px',
                height: '14px',
                background: data.valueOutConnected ? varColor : 'transparent',
                border: `2px solid ${varColor}`,
                borderRadius: '50%',
                position: 'absolute',
                right: '-7px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// UE5 Branch (If) Node
export const UE5BranchNode = ({ data, selected }: any) => {
  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '4px',
      border: selected ? '2px solid #ffd700' : '1px solid #333',
      minWidth: '180px',
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(to bottom, #4a4a4a, #2a2a2a)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px 4px 0 0',
        fontSize: '11px',
        fontWeight: 'bold',
        borderBottom: '1px solid #1a1a1a'
      }}>
        FLOW CONTROL
      </div>
      
      {/* 노드 제목 */}
      <div style={{
        padding: '6px 12px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '13px',
        borderBottom: '1px solid #333'
      }}>
        Branch
      </div>
      
      {/* 핀들 */}
      <div style={{ padding: '8px 0' }}>
        {/* 입력 Execution */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '2px 12px',
          marginBottom: '8px'
        }}>
          <BlueprintPin 
            type="target" 
            position={Position.Left} 
            id="exec-in"
            isExecution={true}
            isConnected={data.execInConnected}
          />
          <span style={{ marginLeft: '20px', color: '#ccc', fontSize: '11px' }}>exec</span>
        </div>
        
        {/* Condition 입력 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '2px 12px',
          marginBottom: '8px'
        }}>
          <Handle
            type="target"
            position={Position.Left}
            id="condition"
            style={{
              width: '14px',
              height: '14px',
              background: data.conditionConnected ? DataTypeColors.boolean : 'transparent',
              border: `2px solid ${DataTypeColors.boolean}`,
              borderRadius: '50%',
              position: 'absolute',
              left: '-7px'
            }}
          />
          <span style={{ 
            marginLeft: '20px', 
            color: DataTypeColors.boolean,
            fontSize: '11px'
          }}>
            Condition
          </span>
        </div>
        
        {/* True/False 출력 */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'flex-end',
          padding: '0 12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', color: '#4CAF50', fontSize: '11px' }}>True</span>
            <BlueprintPin 
              type="source" 
              position={Position.Right} 
              id="true"
              isExecution={true}
              isConnected={data.trueConnected}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', color: '#f44336', fontSize: '11px' }}>False</span>
            <BlueprintPin 
              type="source" 
              position={Position.Right} 
              id="false"
              isExecution={true}
              isConnected={data.falseConnected}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Node type 매핑
export const ue5NodeTypes = {
  ue5Event: UE5EventNode,
  ue5Function: UE5FunctionNode,
  ue5Get: UE5GetNode,
  ue5Set: UE5SetNode,
  ue5Branch: UE5BranchNode,
}