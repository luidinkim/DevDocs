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

// UE5 Event Node (빨간색 헤더)
export const UE5EventNode = ({ data, selected }: any) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
      borderRadius: '6px',
      border: selected ? '2px solid #ffd700' : '1px solid #404040',
      minWidth: '220px',
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: selected 
        ? '0 0 20px rgba(255, 215, 0, 0.3), 0 4px 12px rgba(0,0,0,0.8)' 
        : '0 4px 12px rgba(0,0,0,0.6)',
      position: 'relative',
    }}>
      {/* 하이라이트 효과 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        borderRadius: '6px 6px 0 0'
      }} />
      
      {/* 헤더 - 빨간색 */}
      <div style={{
        background: 'linear-gradient(135deg, #a61e1e 0%, #7a1515 100%)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px 5px 0 0',
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        borderBottom: '1px solid #4a0000',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        EVENT
      </div>
      
      {/* 노드 제목 */}
      <div style={{
        padding: '8px 12px',
        color: '#f0f0f0',
        fontWeight: '600',
        fontSize: '13px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
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
          marginBottom: '4px',
          position: 'relative'
        }}>
          <span style={{ marginRight: '20px' }}>exec</span>
          <Handle
            type="source"
            position={Position.Right}
            id="exec"
            style={{
              width: '13px',
              height: '13px',
              background: data.execConnected 
                ? `radial-gradient(circle, ${DataTypeColors.exec}, ${DataTypeColors.exec}dd)` 
                : 'rgba(0,0,0,0.3)',
              border: `2px solid ${DataTypeColors.exec}`,
              borderRadius: '0',
              clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
              position: 'absolute',
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%) rotate(90deg)',
              boxShadow: data.execConnected 
                ? `0 0 8px ${DataTypeColors.exec}88, inset 0 1px 2px rgba(255,255,255,0.3)` 
                : 'inset 0 1px 2px rgba(0,0,0,0.5)',
              transition: 'all 0.2s ease'
            }}
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
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
      borderRadius: '6px',
      border: selected ? '2px solid #ffd700' : '1px solid #404040',
      minWidth: '240px',
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: selected 
        ? '0 0 20px rgba(255, 215, 0, 0.3), 0 4px 12px rgba(0,0,0,0.8)' 
        : '0 4px 12px rgba(0,0,0,0.6)',
      position: 'relative',
    }}>
      {/* 하이라이트 효과 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        borderRadius: '6px 6px 0 0'
      }} />
      
      {/* 헤더 - 파란색 (Pure Function은 초록색) */}
      <div style={{
        background: data.isPure 
          ? 'linear-gradient(135deg, #0d7938 0%, #0a5828 100%)'
          : 'linear-gradient(135deg, #1a5fb4 0%, #134a8e 100%)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px 5px 0 0',
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        borderBottom: data.isPure ? '1px solid #084020' : '1px solid #0a3060',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        {data.category || 'FUNCTION'}
      </div>
      
      {/* 노드 제목 */}
      <div style={{
        padding: '8px 12px',
        color: '#f0f0f0',
        fontWeight: '600',
        fontSize: '13px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
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
            marginBottom: '8px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
              <Handle
                type="target"
                position={Position.Left}
                id="exec-in"
                style={{
                  width: '13px',
                  height: '13px',
                  background: data.execInConnected 
                    ? `radial-gradient(circle, ${DataTypeColors.exec}, ${DataTypeColors.exec}dd)` 
                    : 'rgba(0,0,0,0.3)',
                  border: `2px solid ${DataTypeColors.exec}`,
                  borderRadius: '0',
                  clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
                  position: 'absolute',
                  left: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(90deg)',
                  boxShadow: data.execInConnected 
                    ? `0 0 8px ${DataTypeColors.exec}88, inset 0 1px 2px rgba(255,255,255,0.3)` 
                    : 'inset 0 1px 2px rgba(0,0,0,0.5)',
                  transition: 'all 0.2s ease'
                }}
              />
              <span style={{ marginLeft: '8px', fontSize: '11px' }}>exec</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
              <span style={{ marginRight: '8px', fontSize: '11px' }}>then</span>
              <Handle
                type="source"
                position={Position.Right}
                id="exec-out"
                style={{
                  width: '13px',
                  height: '13px',
                  background: data.execOutConnected 
                    ? `radial-gradient(circle, ${DataTypeColors.exec}, ${DataTypeColors.exec}dd)` 
                    : 'rgba(0,0,0,0.3)',
                  border: `2px solid ${DataTypeColors.exec}`,
                  borderRadius: '0',
                  clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
                  position: 'absolute',
                  right: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(90deg)',
                  boxShadow: data.execOutConnected 
                    ? `0 0 8px ${DataTypeColors.exec}88, inset 0 1px 2px rgba(255,255,255,0.3)` 
                    : 'inset 0 1px 2px rgba(0,0,0,0.5)',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
          </div>
        )}
        
        {/* 데이터 입력 핀 */}
        {inputs.map((input: PinData, index: number) => {
          return (
            <div key={`input-${index}`} style={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: '2px 12px',
              minHeight: '24px',
              position: 'relative'
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
                  left: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)'
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
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #252525 100%)',
                  border: '1px solid #3a3a3a',
                  borderRadius: '3px',
                  color: '#e0e0e0',
                  padding: '3px 8px',
                  fontSize: '10px',
                  width: '80px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #5a5a5a'
                  e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.3), 0 0 5px rgba(100,100,100,0.3)'
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #3a3a3a'
                  e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.3)'
                }}
              />
            )}
            </div>
          )
        })}
        
        {/* 데이터 출력 핀 */}
        {outputs.map((output: PinData, index: number) => {
          return (
            <div key={`output-${index}`} style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '2px 12px',
              minHeight: '24px',
              position: 'relative'
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
                  right: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
          )
        })}
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
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
      borderRadius: '6px',
      border: selected ? '2px solid #ffd700' : '1px solid #404040',
      minWidth: '160px',
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: selected 
        ? '0 0 20px rgba(255, 215, 0, 0.3), 0 4px 12px rgba(0,0,0,0.8)' 
        : '0 4px 12px rgba(0,0,0,0.6)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* GET 인디케이터 */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: `linear-gradient(135deg, ${varColor}dd, ${varColor}99)`,
        color: 'white',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '9px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        GET
      </div>
      
      {/* 변수 이름 */}
      <div style={{
        padding: '14px',
        color: '#f0f0f0',
        fontWeight: '600',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: '4px',
          height: '32px',
          background: `linear-gradient(180deg, ${varColor}, ${varColor}88)`,
          marginRight: '10px',
          borderRadius: '2px',
          boxShadow: `0 0 8px ${varColor}44`
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
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
      borderRadius: '6px',
      border: selected ? '2px solid #ffd700' : '1px solid #404040',
      minWidth: '200px',
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: selected 
        ? '0 0 20px rgba(255, 215, 0, 0.3), 0 4px 12px rgba(0,0,0,0.8)' 
        : '0 4px 12px rgba(0,0,0,0.6)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* SET 인디케이터 */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: `linear-gradient(135deg, ${varColor}dd, ${varColor}99)`,
        color: 'white',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '9px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        SET
      </div>
      
      {/* 변수 이름 */}
      <div style={{
        padding: '10px 12px',
        color: '#f0f0f0',
        fontWeight: '600',
        fontSize: '13px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: '4px',
          height: '22px',
          background: `linear-gradient(180deg, ${varColor}, ${varColor}88)`,
          marginRight: '10px',
          borderRadius: '2px',
          boxShadow: `0 0 8px ${varColor}44`
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
          marginBottom: '8px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
            <Handle
              type="target"
              position={Position.Left}
              id="exec-in"
              style={{
                width: '13px',
                height: '13px',
                background: data.execInConnected 
                  ? `radial-gradient(circle, ${DataTypeColors.exec}, ${DataTypeColors.exec}dd)` 
                  : 'rgba(0,0,0,0.3)',
                border: `2px solid ${DataTypeColors.exec}`,
                borderRadius: '0',
                clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
                position: 'absolute',
                left: '-8px',
                top: '50%',
                transform: 'translateY(-50%) rotate(90deg)',
                boxShadow: data.execInConnected 
                  ? `0 0 8px ${DataTypeColors.exec}88, inset 0 1px 2px rgba(255,255,255,0.3)` 
                  : 'inset 0 1px 2px rgba(0,0,0,0.5)',
                transition: 'all 0.2s ease'
              }}
            />
            <span style={{ marginLeft: '20px', fontSize: '11px' }}>exec</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
            <span style={{ marginRight: '20px', fontSize: '11px' }}>exec</span>
            <Handle
              type="source"
              position={Position.Right}
              id="exec-out"
              style={{
                width: '13px',
                height: '13px',
                background: data.execOutConnected 
                  ? `radial-gradient(circle, ${DataTypeColors.exec}, ${DataTypeColors.exec}dd)` 
                  : 'rgba(0,0,0,0.3)',
                border: `2px solid ${DataTypeColors.exec}`,
                borderRadius: '0',
                clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
                position: 'absolute',
                right: '-8px',
                top: '50%',
                transform: 'translateY(-50%) rotate(90deg)',
                boxShadow: data.execOutConnected 
                  ? `0 0 8px ${DataTypeColors.exec}88, inset 0 1px 2px rgba(255,255,255,0.3)` 
                  : 'inset 0 1px 2px rgba(0,0,0,0.5)',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
        </div>
        
        {/* 값 입력 핀 (새 값) */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '2px 12px',
          marginBottom: '6px',
          position: 'relative'
        }}>
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
              left: '-8px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <span style={{ 
            marginLeft: '20px', 
            color: varColor,
            fontSize: '11px'
          }}>
            {data.label || 'Value'}
          </span>
          {!data.valueInConnected && (
            <input
              type="text"
              defaultValue={data.defaultValue || '0'}
              style={{
                marginLeft: '8px',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #252525 100%)',
                border: '1px solid #3a3a3a',
                borderRadius: '3px',
                color: '#e0e0e0',
                padding: '3px 8px',
                fontSize: '10px',
                width: '60px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                outline: 'none'
              }}
            />
          )}
        </div>
        
        {/* 값 출력 핀 (패스스루) */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '2px 12px',
          position: 'relative'
        }}>
          <span style={{ 
            marginRight: '20px', 
            color: varColor,
            fontSize: '11px',
            opacity: 0.7
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
              right: '-8px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
        </div>
      </div>
    </div>
  )
}

// UE5 Cast Node
export const UE5CastNode = ({ data, selected }: any) => {
  const targetClass = data.targetClass || 'Character'
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
      borderRadius: '6px',
      border: selected ? '2px solid #ffd700' : '1px solid #404040',
      minWidth: '240px',
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: selected 
        ? '0 0 20px rgba(255, 215, 0, 0.3), 0 4px 12px rgba(0,0,0,0.8)' 
        : '0 4px 12px rgba(0,0,0,0.6)',
      position: 'relative',
    }}>
      {/* 하이라이트 효과 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        borderRadius: '6px 6px 0 0'
      }} />
      
      {/* 헤더 - Cast 노드는 파란색 계열 */}
      <div style={{
        background: 'linear-gradient(135deg, #2b3d5f 0%, #1a2840 100%)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px 5px 0 0',
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        borderBottom: '1px solid #1a2840',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        CAST
      </div>
      
      {/* 노드 제목 */}
      <div style={{
        padding: '8px 12px',
        color: '#f0f0f0',
        fontWeight: 'bold',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #333',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <span style={{ opacity: 0.7, fontSize: '11px', marginRight: '6px' }}>Cast To</span>
        <span style={{ color: '#4db8ff' }}>{targetClass}</span>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '4px 0'
      }}>
        {/* 실행 입력 핀 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '4px 12px',
          position: 'relative'
        }}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            style={{
              width: '16px',
              height: '16px',
              background: data.execInConnected ? '#ffffff' : 'transparent',
              border: '2px solid #ffffff',
              borderRadius: '0',
              clipPath: 'polygon(0% 50%, 30% 0%, 100% 0%, 100% 100%, 30% 100%)',
              position: 'absolute',
              left: '-9px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
        </div>
        
        {/* Object 입력 핀 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '4px 12px',
          position: 'relative'
        }}>
          <Handle
            type="target"
            position={Position.Left}
            id="object-in"
            style={{
              width: '14px',
              height: '14px',
              background: data.objectConnected ? DataTypeColors.object : 'transparent',
              border: `2px solid ${DataTypeColors.object}`,
              borderRadius: '50%',
              position: 'absolute',
              left: '-8px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <span style={{ 
            marginLeft: '20px', 
            color: DataTypeColors.object,
            fontSize: '11px'
          }}>
            Object
          </span>
        </div>
        
        {/* 성공 실행 출력 핀 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '4px 12px',
          position: 'relative'
        }}>
          <span style={{ 
            marginRight: '20px', 
            color: '#ffffff',
            fontSize: '11px'
          }}>
            
          </span>
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            style={{
              width: '16px',
              height: '16px',
              background: data.execOutConnected ? '#ffffff' : 'transparent',
              border: '2px solid #ffffff',
              borderRadius: '0',
              clipPath: 'polygon(70% 0%, 100% 50%, 70% 100%, 0% 100%, 0% 0%)',
              position: 'absolute',
              right: '-9px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
        </div>
        
        {/* Cast Failed 실행 출력 핀 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '4px 12px',
          position: 'relative'
        }}>
          <span style={{ 
            marginRight: '20px', 
            color: '#ff6b6b',
            fontSize: '11px',
            fontStyle: 'italic'
          }}>
            Cast Failed
          </span>
          <Handle
            type="source"
            position={Position.Right}
            id="exec-failed"
            style={{
              width: '16px',
              height: '16px',
              background: data.execFailedConnected ? '#ffffff' : 'transparent',
              border: '2px solid #ffffff',
              borderRadius: '0',
              clipPath: 'polygon(70% 0%, 100% 50%, 70% 100%, 0% 100%, 0% 0%)',
              position: 'absolute',
              right: '-9px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
        </div>
        
        {/* As [Class] 출력 핀 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '4px 12px',
          position: 'relative',
          borderTop: '1px solid #333',
          marginTop: '4px'
        }}>
          <span style={{ 
            marginRight: '20px', 
            color: DataTypeColors.object,
            fontSize: '11px',
            fontWeight: '600'
          }}>
            As {targetClass}
          </span>
          <Handle
            type="source"
            position={Position.Right}
            id="cast-out"
            style={{
              width: '14px',
              height: '14px',
              background: data.castOutConnected ? DataTypeColors.object : 'transparent',
              border: `2px solid ${DataTypeColors.object}`,
              borderRadius: '50%',
              position: 'absolute',
              right: '-8px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
        </div>
      </div>
    </div>
  )
}

// UE5 Branch (If) Node
export const UE5BranchNode = ({ data, selected }: any) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
      borderRadius: '6px',
      border: selected ? '2px solid #ffd700' : '1px solid #404040',
      minWidth: '200px',
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: selected 
        ? '0 0 20px rgba(255, 215, 0, 0.3), 0 4px 12px rgba(0,0,0,0.8)' 
        : '0 4px 12px rgba(0,0,0,0.6)',
      position: 'relative',
    }}>
      {/* 하이라이트 효과 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        borderRadius: '6px 6px 0 0'
      }} />
      
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #5a5a5a 0%, #3a3a3a 100%)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px 5px 0 0',
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        borderBottom: '1px solid #2a2a2a',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        FLOW CONTROL
      </div>
      
      {/* 노드 제목 */}
      <div style={{
        padding: '8px 12px',
        color: '#f0f0f0',
        fontWeight: '600',
        fontSize: '13px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
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
          marginBottom: '8px',
          position: 'relative'
        }}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            style={{
              width: '13px',
              height: '13px',
              background: data.execInConnected 
                ? `radial-gradient(circle, ${DataTypeColors.exec}, ${DataTypeColors.exec}dd)` 
                : 'rgba(0,0,0,0.3)',
              border: `2px solid ${DataTypeColors.exec}`,
              borderRadius: '0',
              clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
              position: 'absolute',
              left: '-8px',
              top: '50%',
              transform: 'translateY(-50%) rotate(90deg)',
              boxShadow: data.execInConnected 
                ? `0 0 8px ${DataTypeColors.exec}88, inset 0 1px 2px rgba(255,255,255,0.3)` 
                : 'inset 0 1px 2px rgba(0,0,0,0.5)',
              transition: 'all 0.2s ease'
            }}
          />
          <span style={{ marginLeft: '20px', color: '#ccc', fontSize: '11px' }}>exec</span>
        </div>
        
        {/* Condition 입력 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '2px 12px',
          marginBottom: '8px',
          position: 'relative'
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
              left: '-8px',
              top: '50%',
              transform: 'translateY(-50%)'
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
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <span style={{ marginRight: '20px', color: '#4CAF50', fontSize: '11px' }}>True</span>
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              style={{
                width: '13px',
                height: '13px',
                background: data.trueConnected 
                  ? `radial-gradient(circle, ${DataTypeColors.exec}, ${DataTypeColors.exec}dd)` 
                  : 'rgba(0,0,0,0.3)',
                border: `2px solid ${DataTypeColors.exec}`,
                borderRadius: '0',
                clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
                position: 'absolute',
                right: '-8px',
                top: '50%',
                transform: 'translateY(-50%) rotate(90deg)',
                boxShadow: data.trueConnected 
                  ? `0 0 8px ${DataTypeColors.exec}88, inset 0 1px 2px rgba(255,255,255,0.3)` 
                  : 'inset 0 1px 2px rgba(0,0,0,0.5)',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <span style={{ marginRight: '20px', color: '#f44336', fontSize: '11px' }}>False</span>
            <Handle
              type="source"
              position={Position.Right}
              id="false"
              style={{
                width: '13px',
                height: '13px',
                background: data.falseConnected 
                  ? `radial-gradient(circle, ${DataTypeColors.exec}, ${DataTypeColors.exec}dd)` 
                  : 'rgba(0,0,0,0.3)',
                border: `2px solid ${DataTypeColors.exec}`,
                borderRadius: '0',
                clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
                position: 'absolute',
                right: '-8px',
                top: '50%',
                transform: 'translateY(-50%) rotate(90deg)',
                boxShadow: data.falseConnected 
                  ? `0 0 8px ${DataTypeColors.exec}88, inset 0 1px 2px rgba(255,255,255,0.3)` 
                  : 'inset 0 1px 2px rgba(0,0,0,0.5)',
                transition: 'all 0.2s ease'
              }}
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
  ue5Cast: UE5CastNode,
}