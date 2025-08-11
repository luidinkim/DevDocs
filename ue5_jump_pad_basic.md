# UE5 점프패드 개발 가이드 - 1단계: 기초편

## 개요
이 가이드는 언리얼 엔진 5에서 가장 기본적인 점프패드를 만드는 방법을 설명합니다. 
단순히 캐릭터를 위로 발사하는 기능만 구현합니다.

## 1. 블루프린트 생성

### 1.1 새 액터 블루프린트 만들기
1. Content Browser에서 우클릭
2. Blueprint Class 선택
3. Actor 선택
4. 이름을 `BP_JumpPad_Basic`으로 지정

## 2. 컴포넌트 설정

### 2.1 필수 컴포넌트 추가
```
BP_JumpPad_Basic (Actor)
├── DefaultSceneRoot
├── StaticMesh (패드 모양)
└── BoxCollision (트리거 영역)
```

### 2.2 컴포넌트 세부 설정

#### Static Mesh 설정
- **Mesh**: 기본 큐브 또는 원하는 메시 선택
- **Scale**: (2, 2, 0.2) - 납작한 패드 모양
- **Material**: 기본 머티리얼 사용

#### Box Collision 설정
- **Box Extent**: (100, 100, 50)
- **Location Z**: 50 (패드 위에 위치)
- **Collision Presets**: OverlapAllDynamic

## 3. 이벤트 그래프 구현

### 3.1 가장 단순한 Launch Character 구현

```
Event Graph:

[On Component Begin Overlap (Box Collision)]
    ↓
[Cast to Character]
    ↓ (성공)
[Launch Character]
    - Launch Velocity: (0, 0, 1500)
    - XY Override: False
    - Z Override: True
```

### 3.2 블루프린트 노드 연결 방법

1. **On Component Begin Overlap 노드 추가**
   - Box Collision 컴포넌트 선택
   - Details 패널에서 Events 섹션 찾기
   - On Component Begin Overlap 옆 + 버튼 클릭

2. **Cast to Character 노드 연결**
   - Other Actor 핀을 Cast to Character의 Object 핀에 연결

3. **Launch Character 노드 추가**
   - Cast to Character의 As Character 핀을 Target에 연결
   - Launch Velocity를 (0, 0, 1500)으로 설정
   - Z Override를 체크하여 True로 설정

## 4. 테스트 방법

1. 블루프린트를 컴파일하고 저장
2. 레벨에 BP_JumpPad_Basic 배치
3. Play In Editor (PIE) 실행
4. 캐릭터로 패드 위를 지나가면 위로 발사됨

## 5. 문제 해결

### 작동하지 않을 때
- Box Collision의 Collision Presets 확인
- Generate Overlap Events가 체크되어 있는지 확인
- 캐릭터가 Character 클래스인지 확인

### 너무 높이/낮게 날아갈 때
- Launch Velocity의 Z 값 조정 (기본 1500)
- 값 범위: 500(낮음) ~ 3000(높음)

## 다음 단계
이제 기본적인 점프패드가 완성되었습니다. 
다음 가이드에서는 변수를 추가하여 쉽게 조정 가능한 점프패드를 만들어봅시다.

→ [2단계: 변수와 방향 설정](ue5_jump_pad_intermediate.md)