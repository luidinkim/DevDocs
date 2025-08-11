# UE5 점프맵 특수 기능 블루프린트 가이드

## 1. 점프 패드 (BP_JumpPad)

### 컴포넌트 구성
```
BP_JumpPad (Actor)
├── DefaultSceneRoot
├── StaticMesh (패드 메시)
│   └── Material: M_JumpPad (발광 효과)
├── BoxCollision (트리거 영역)
│   └── BoxExtent: (100, 100, 50)
├── ArrowComponent (발사 방향 표시)
│   ├── RelativeRotation: (-45, 0, 0) // 45도 위쪽 각도
│   ├── ArrowSize: 2.0
│   └── ArrowColor: (0, 1, 0) // 녹색
├── ParticleSystem (시각 효과)
│   └── Template: P_JumpPad_Idle
└── AudioComponent (사운드 효과)
    └── Sound: S_JumpPad_Activate
```

### 변수 설정
- **JumpForce** (Float): 2000.0 - 점프 강도
- **bOverrideVelocity** (Boolean): True - 기존 속도 무시
- **bOverrideXY** (Boolean): True - XY 속도 덮어쓰기
- **bOverrideZ** (Boolean): True - Z 속도 덮어쓰기
- **bCanReactivate** (Boolean): True - 재사용 가능
- **ReactivateDelay** (Float): 0.5 - 재사용 대기시간
- **bShowTrajectory** (Boolean): True - 에디터에서 궤적 표시
- **TrajectoryPoints** (Integer): 30 - 궤적 표시 포인트 수

### Event Graph

#### BeginPlay
```
Event BeginPlay
├── Set Collision Response to Channel
│   ├── Channel: Pawn
│   └── Response: Overlap
└── Validate Arrow Component
    └── IsValid Check
```

#### On Component Begin Overlap (BoxCollision)
```
On Component Begin Overlap (BoxCollision)
├── Cast to Character
│   └── Object: Other Actor
├── Branch (Is Valid)
│   └── True:
│       ├── Get Launch Direction from Arrow
│       │   ├── Get Arrow Component
│       │   ├── Get Forward Vector (ArrowComponent)
│       │   └── Store as Launch Direction
│       ├── Calculate Launch Velocity
│       │   ├── Normalize Launch Direction
│       │   └── Multiply (Direction * JumpForce)
│       ├── Launch Character
│       │   ├── Launch Velocity: Calculated Vector
│       │   ├── XYOverride: bOverrideXY
│       │   └── ZOverride: bOverrideZ
│       ├── Play Effects
│       │   ├── Play Sound at Location
│       │   ├── Spawn Emitter at Location
│       │   └── Camera Shake (optional)
│       └── Handle Reactivation
│           ├── Branch (bCanReactivate)
│           │   └── True:
│           │       ├── Disable Collision
│           │       └── Set Timer by Event
│           │           ├── Time: ReactivateDelay
│           │           └── Event: ReEnableCollision
```

#### Custom Function: GetLaunchVelocityFromArrow
```
Function GetLaunchVelocityFromArrow
├── Get Arrow Component
├── Get World Rotation (ArrowComponent)
├── Get Forward Vector
├── Multiply by JumpForce
└── Return: LaunchVelocity (Vector)
```

#### Construction Script (에디터 미리보기)
```
Construction Script
├── Branch (bShowTrajectory)
│   └── True:
│       ├── Clear Debug Lines
│       ├── Get Arrow Forward Vector
│       ├── Calculate Trajectory Points
│       │   ├── For Loop (0 to TrajectoryPoints)
│       │   │   ├── Calculate Time (i * 0.1)
│       │   │   ├── Calculate Position
│       │   │   │   ├── X = InitialVelocity.X * Time
│       │   │   │   ├── Y = InitialVelocity.Y * Time
│       │   │   │   └── Z = InitialVelocity.Z * Time - (0.5 * Gravity * Time²)
│       │   │   └── Draw Debug Point
│       │   └── Draw Debug Lines Between Points
│       └── Draw Debug Arrow (큰 화살표)
│           ├── Start: Pad Location
│           ├── End: Pad Location + (Arrow Forward * 200)
│           └── Color: Green
```

#### Custom Event: ReEnableCollision
```
Custom Event: ReEnableCollision
├── Set Collision Enabled
│   └── Collision Enabled: Query and Physics
├── Spawn Reactivation Effect
│   └── Particle: P_JumpPad_Ready
└── Play Ready Sound
```

---

## 2. 에스컬레이터/무빙 플랫폼 (BP_MovingPlatform)

### 컴포넌트 구성
```
BP_MovingPlatform (Actor)
├── DefaultSceneRoot
├── StaticMesh (플랫폼 메시)
│   └── Mobility: Movable
├── BoxCollision (플레이어 감지)
│   └── BoxExtent: (200, 100, 20)
├── SplineComponent (이동 경로)
│   └── Points: 최소 2개 이상
├── ArrowComponent (현재 방향)
└── NiagaraSystem (옵션: 트레일 효과)
```

### 변수 설정
- **MoveSpeed** (Float): 300.0 - 이동 속도
- **WaitTimeAtPoints** (Float): 2.0 - 각 포인트 대기시간
- **bLoop** (Boolean): True - 순환 여부
- **bReverse** (Boolean): False - 역방향 이동
- **CurrentSplineDistance** (Float): 0.0
- **CurrentDirection** (Float): 1.0 (1=정방향, -1=역방향)
- **PlayersOnPlatform** (Array<Character>): 플랫폼 위 플레이어들
- **bIsMoving** (Boolean): True
- **InterpolationMode** (Enum): Linear/Smooth

### Event Graph

#### BeginPlay
```
Event BeginPlay
├── Get Spline Length
├── Set Initial Position
│   └── Set Actor Location (Spline Point 0)
└── Start Movement Timer
```

#### Event Tick
```
Event Tick
├── Branch (bIsMoving)
│   └── True:
│       ├── Calculate New Position
│       │   ├── Delta Time * MoveSpeed * CurrentDirection
│       │   └── Add to CurrentSplineDistance
│       ├── Get Location at Distance Along Spline
│       │   └── Distance: CurrentSplineDistance
│       ├── Set Actor Location
│       │   └── Sweep: True
│       ├── Update Players on Platform
│       │   └── ForEach (PlayersOnPlatform)
│       │       └── Add World Offset
│       └── Check End Points
│           ├── Branch (CurrentSplineDistance >= SplineLength)
│           │   ├── True: Handle End Point
│           │   └── False: Branch (CurrentSplineDistance <= 0)
│           │       └── True: Handle Start Point
```

#### On Component Begin/End Overlap
```
On Component Begin Overlap (BoxCollision)
├── Cast to Character
├── Add to PlayersOnPlatform Array
└── Attach to Component
    ├── Target: Character Mesh
    ├── Parent: Platform Mesh
    └── Attach Type: Keep World

On Component End Overlap (BoxCollision)
├── Cast to Character
├── Remove from PlayersOnPlatform Array
└── Detach from Component
    └── Detachment Type: Keep World
```

#### Custom Function: HandleEndPoint
```
Function HandleEndPoint
├── Branch (bLoop)
│   ├── True: 
│   │   └── Set CurrentSplineDistance to 0
│   └── False:
│       ├── Branch (bReverse)
│       │   ├── True: 
│       │   │   └── Set CurrentDirection to -1
│       │   └── False:
│       │       └── Set bIsMoving to False
│       └── Delay (WaitTimeAtPoints)
```

---

## 3. 순간이동 포털 (BP_TeleportPortal)

### 컴포넌트 구성
```
BP_TeleportPortal (Actor)
├── DefaultSceneRoot
├── StaticMesh (포털 프레임)
├── CapsuleComponent (트리거 영역)
│   └── Radius: 60, Half Height: 100
├── SceneCapture2D (포털 뷰 - 옵션)
│   └── Texture Target: RT_PortalView
├── StaticMesh (포털 표면)
│   └── Material: M_Portal (렌더 타겟 사용)
├── ParticleSystem (포털 효과)
│   └── Template: P_Portal_Active
├── AudioComponent (앰비언트 사운드)
│   └── Sound: S_Portal_Ambient
└── ArrowComponent (텔레포트 방향)
```

### 변수 설정
- **LinkedPortal** (BP_TeleportPortal Reference): 연결된 포털
- **TeleportOffset** (Vector): (0, 0, 100) - 텔레포트 위치 오프셋
- **bMaintainVelocity** (Boolean): True - 속도 유지
- **bMaintainRotation** (Boolean): False - 회전 유지
- **CooldownTime** (Float): 1.0 - 재사용 대기시간
- **RecentlyTeleported** (Array<Character>): 최근 텔레포트된 캐릭터
- **PortalColor** (LinearColor): 포털 색상
- **bIsActive** (Boolean): True - 활성화 상태
- **TeleportDelay** (Float): 0.1 - 텔레포트 지연시간

### Event Graph

#### BeginPlay
```
Event BeginPlay
├── Validate Linked Portal
│   └── IsValid (LinkedPortal)
├── Setup Portal Material
│   ├── Create Dynamic Material Instance
│   └── Set Vector Parameter (PortalColor)
├── Setup Scene Capture (옵션)
│   └── Set Capture Target
└── Start Portal Effects
```

#### On Component Begin Overlap (CapsuleComponent)
```
On Component Begin Overlap
├── Cast to Character
├── Branch (Is Valid Character)
│   └── True:
│       ├── Check if in RecentlyTeleported Array
│       │   └── Branch (Not Recently Teleported)
│       │       └── True:
│       │           ├── Get Character Velocity
│       │           ├── Store Current Transform
│       │           ├── Play Teleport Effects
│       │           │   ├── Spawn Emitter at Location (Entry)
│       │           │   └── Play Sound at Location
│       │           ├── Delay (TeleportDelay)
│       │           ├── Calculate Teleport Transform
│       │           │   ├── Get Linked Portal Transform
│       │           │   ├── Add TeleportOffset
│       │           │   └── Calculate Rotation if bMaintainRotation
│       │           ├── Teleport Character
│       │           │   ├── Set Actor Location
│       │           │   └── Set Actor Rotation (optional)
│       │           ├── Apply Velocity
│       │           │   └── Branch (bMaintainVelocity)
│       │           │       └── Launch Character
│       │           ├── Add to LinkedPortal.RecentlyTeleported
│       │           ├── Play Exit Effects
│       │           │   └── Spawn Emitter at Location (Exit)
│       │           └── Set Timer for Cooldown
│       │               └── Remove from RecentlyTeleported
```

#### Custom Function: CalculateRelativeTransform
```
Function CalculateRelativeTransform
├── Inputs: ActorTransform, SourcePortal, TargetPortal
├── Get Relative Transform
│   ├── Transform - SourcePortal Transform
│   └── Convert to Local Space
├── Apply to Target Portal
│   └── Convert to World Space (TargetPortal)
├── Apply Rotation Adjustment
│   └── Add 180 degrees to Yaw
└── Return: NewTransform
```

#### Custom Function: SetupPortalView (고급 기능)
```
Function SetupPortalView
├── Create Render Target 2D
├── Set Scene Capture Target
├── Calculate View Matrix
│   ├── Get Player Camera Location
│   ├── Calculate Relative Position to This Portal
│   └── Apply to Linked Portal Camera
├── Update Capture Every Frame
└── Apply to Portal Material
```

---

## 4. 체크포인트 시스템 (BP_Checkpoint)

### 컴포넌트 구성
```
BP_Checkpoint (Actor)
├── DefaultSceneRoot
├── StaticMesh (체크포인트 플래그/마커)
├── BoxCollision (트리거 영역)
├── PointLight (활성화 표시)
├── TextRender (체크포인트 번호)
└── ParticleSystem (활성화 효과)
```

### 변수 설정
- **CheckpointID** (Integer): 고유 ID
- **bIsActivated** (Boolean): False
- **RespawnTransform** (Transform): 리스폰 위치
- **ActivatedColor** (LinearColor): (0, 1, 0)
- **DeactivatedColor** (LinearColor): (1, 0, 0)

### Event Graph
```
On Component Begin Overlap
├── Cast to Character
├── Get Game Mode
├── Cast to Jump Map Game Mode
├── Call SetPlayerCheckpoint
│   ├── Player: Character
│   └── Checkpoint: Self
├── Set bIsActivated to True
├── Update Visual State
│   ├── Set Light Color
│   └── Spawn Activation Particle
└── Play Sound Effect
```

---

## 5. 게임모드 통합 (GM_JumpMap)

### 변수 설정
- **PlayerCheckpoints** (Map<PlayerController, BP_Checkpoint>)
- **CompletionTime** (Float)
- **CurrentCheckpoint** (Integer)

### 주요 함수
```
Function RespawnPlayer
├── Input: PlayerController
├── Get Checkpoint from Map
├── Get Respawn Transform
└── Spawn/Teleport Player

Function SetPlayerCheckpoint
├── Input: Player, Checkpoint
├── Update PlayerCheckpoints Map
└── Save Progress

Function OnPlayerFallOut
├── Input: Player
├── Call RespawnPlayer
└── Apply Fall Penalty (optional)
```

---

## 사용 팁

1. **점프 패드**: LaunchAngle과 JumpForce를 조절하여 다양한 궤적 생성
2. **무빙 플랫폼**: SplineComponent의 포인트를 추가하여 복잡한 경로 생성
3. **포털**: LinkedPortal을 반드시 설정하고, 양방향 연결 확인
4. **체크포인트**: 게임모드와 연동하여 진행상황 저장

## 최적화 고려사항
- Tick 이벤트 사용 최소화
- 타이머 활용으로 성능 향상
- LOD 설정으로 원거리 객체 최적화
- 네트워크 리플리케이션 설정 (멀티플레이어의 경우)