# 언리얼 엔진 5 초보자 가이드

## 목차
1. [언리얼 엔진 5 소개](#언리얼-엔진-5-소개)
2. [엔진 인터페이스 레이아웃](#엔진-인터페이스-레이아웃)
3. [튜토리얼 1: 첫 프로젝트 생성하기](#튜토리얼-1-첫-프로젝트-생성하기)
4. [튜토리얼 2: 기본 레벨 디자인](#튜토리얼-2-기본-레벨-디자인)
5. [튜토리얼 3: 블루프린트 기초](#튜토리얼-3-블루프린트-기초)
6. [다음 단계](#다음-단계)

---

## 언리얼 엔진 5 소개

언리얼 엔진 5(UE5)는 Epic Games에서 개발한 강력한 게임 엔진으로, AAA급 게임부터 인디 게임, 건축 시각화, 영화 제작까지 다양한 분야에서 사용됩니다.

### 주요 특징
- **Nanite**: 영화 수준의 디테일을 실시간으로 렌더링
- **Lumen**: 완전히 동적인 글로벌 일루미네이션
- **World Partition**: 대규모 오픈 월드 제작 지원
- **Niagara**: 강력한 파티클 시스템
- **무료 사용**: 수익 100만 달러까지 로열티 없음

---

## 엔진 인터페이스 레이아웃

UE5를 처음 실행하면 다음과 같은 주요 인터페이스 요소들을 만나게 됩니다:

### 1. 메인 툴바 (Main Toolbar)
화면 상단에 위치하며 자주 사용하는 기능들에 빠르게 접근할 수 있습니다.

- **Save** (저장): 현재 레벨 저장
- **Save All** (모두 저장): 모든 변경사항 저장
- **Content Drawer** (콘텐츠 드로어): 프로젝트 파일 탐색
- **Blueprints** (블루프린트): 비주얼 스크립팅 시스템
- **Play** (플레이): 게임 테스트 실행
- **Platforms** (플랫폼): 빌드 및 배포 설정

### 2. 뷰포트 (Viewport)
레벨을 시각적으로 편집하는 메인 작업 공간입니다.

#### 뷰포트 조작법:
- **우클릭 + WASD**: 카메라 이동
- **Alt + 좌클릭**: 선택한 오브젝트 중심으로 회전
- **마우스 휠**: 줌 인/아웃
- **F 키**: 선택한 오브젝트에 포커스
- **G 키**: 게임 뷰 모드 전환

#### 뷰포트 모드:
- **Lit** (라이팅): 최종 렌더링 모습
- **Unlit** (언릿): 라이팅 없이 텍스처만 표시
- **Wireframe** (와이어프레임): 메시 구조 표시
- **Detail Lighting** (디테일 라이팅): 라이팅만 표시

### 3. 월드 아웃라이너 (World Outliner)
레벨에 있는 모든 액터(오브젝트)의 계층 구조를 표시합니다.

- 오브젝트 검색 및 필터링
- 가시성 토글 (눈 아이콘)
- 폴더로 정리 가능
- 드래그 앤 드롭으로 계층 구조 변경

### 4. 디테일 패널 (Details Panel)
선택한 액터의 속성을 편집합니다.

- **Transform**: 위치, 회전, 스케일
- **Materials**: 머티리얼 설정
- **Lighting**: 라이팅 속성
- **Physics**: 물리 설정
- **Collision**: 충돌 설정

### 5. 콘텐츠 브라우저 (Content Browser)
프로젝트의 모든 에셋을 관리합니다.

- **필터**: 에셋 타입별로 필터링
- **폴더 구조**: 프로젝트 파일 정리
- **썸네일 크기**: 보기 편한 크기로 조정
- **드래그 앤 드롭**: 에셋을 뷰포트로 직접 배치

### 6. 모드 패널 (Mode Panel)
다양한 편집 도구를 제공합니다.

- **Select Mode**: 기본 선택 모드
- **Landscape Mode**: 지형 편집
- **Foliage Mode**: 식물 배치
- **Mesh Paint**: 메시 페인팅
- **Modeling Mode**: 3D 모델링 도구

---

## 튜토리얼 1: 첫 프로젝트 생성하기

### 목표
첫 번째 UE5 프로젝트를 생성하고 기본 설정을 이해합니다.

### 단계별 가이드

#### 1단계: 언리얼 엔진 실행
1. Epic Games Launcher 실행
2. Library 탭에서 UE5 Launch 클릭
3. Project Browser가 열립니다

#### 2단계: 새 프로젝트 생성
1. **Games** 카테고리 선택
2. **Third Person** 템플릿 선택 (초보자에게 추천)
3. 프로젝트 설정:
   - **Target Platform**: Desktop
   - **Quality Preset**: Maximum
   - **Starter Content**: 포함 (학습용 에셋)
   - **Raytracing**: 비활성화 (성능 고려)

#### 3단계: 프로젝트 이름 및 위치
1. 프로젝트 이름: "MyFirstUE5Project"
2. 저장 위치 선택
3. **Create** 클릭

#### 4단계: 첫 실행
1. 프로젝트가 로드되면 뷰포트에 기본 레벨이 표시됩니다
2. **Play** 버튼(또는 Alt+P)을 눌러 게임 테스트
3. **Esc**를 눌러 플레이 모드 종료

### 학습 포인트
- 템플릿은 빠른 시작을 위한 기본 구조 제공
- Starter Content는 학습용 머티리얼과 메시 포함
- Third Person 템플릿은 캐릭터 컨트롤러 기본 구현 포함

---

## 튜토리얼 2: 기본 레벨 디자인

### 목표
간단한 레벨을 만들어보며 기본 도구 사용법을 익힙니다.

### 단계별 가이드

#### 1단계: 바닥 만들기
1. **Content Drawer** 열기 (Ctrl+Space)
2. **Starter Content > Architecture** 폴더로 이동
3. **Floor_400x400** 메시를 뷰포트로 드래그
4. 위치를 (0, 0, 0)으로 설정 (Details 패널)
5. Scale을 (10, 10, 1)로 설정하여 큰 바닥 생성

#### 2단계: 벽 배치하기
1. **Wall_400x400** 메시를 드래그
2. **W 키**를 눌러 이동 모드 활성화
3. 벽을 바닥 가장자리에 배치
4. **Alt + 드래그**로 복제하여 4면의 벽 생성
5. **E 키**로 회전 모드 전환하여 벽 방향 조정

#### 3단계: 조명 추가
1. **Place Actors** 패널에서 **Lights** 카테고리 선택
2. **Directional Light** (태양광) 추가
3. 회전값 조정: (Pitch: -45, Yaw: 45, Roll: 0)
4. **Point Light** 추가하여 실내 조명 생성
5. Intensity: 5000, Light Color: 따뜻한 색상

#### 4단계: 프롭(소품) 배치
1. **Starter Content > Props** 폴더 탐색
2. 다양한 프롭 배치:
   - Chair (의자)
   - Table (테이블)  
   - MaterialSphere (구체)
3. **R 키**로 스케일 모드 전환하여 크기 조정

#### 5단계: 머티리얼 적용
1. 오브젝트 선택
2. **Starter Content > Materials** 폴더에서 머티리얼 선택
3. Details 패널의 Materials 슬롯에 드래그 앤 드롭
4. 다양한 머티리얼 실험:
   - M_Wood_Floor
   - M_Brick_Clay_New
   - M_Metal_Gold

### 학습 포인트
- 변환 도구 단축키: W(이동), E(회전), R(스케일)
- Alt + 드래그로 빠른 복제 가능
- 그리드 스냅으로 정확한 배치 가능 (그리드 크기 조정 가능)

---

## 튜토리얼 3: 블루프린트 기초

### 목표
비주얼 스크립팅 시스템인 블루프린트로 간단한 상호작용을 구현합니다.

### 단계별 가이드

#### 1단계: 블루프린트 액터 생성
1. Content Drawer에서 우클릭
2. **Blueprint Class** 선택
3. **Actor** 선택 (기본 클래스)
4. 이름: "BP_InteractiveCube"

#### 2단계: 컴포넌트 추가
1. 블루프린트 더블클릭하여 에디터 열기
2. **Components** 패널에서 **Add** 클릭
3. **Static Mesh** 컴포넌트 추가
4. Details에서 Static Mesh를 **Cube**로 설정
5. **Box Collision** 컴포넌트 추가
6. Box Collision 크기를 큐브보다 약간 크게 설정

#### 3단계: 이벤트 그래프 프로그래밍
1. **Event Graph** 탭으로 이동
2. 다음 노드들을 생성 및 연결:

##### 회전 애니메이션:
```
Event Tick → Add Actor Local Rotation
- Delta Rotation: (0, 1, 0)
```

##### 플레이어 접근 시 색상 변경:
```
Box Collision → On Component Begin Overlap
→ Set Material (Target: Static Mesh)
→ Material: 다른 머티리얼 선택

Box Collision → On Component End Overlap  
→ Set Material (Target: Static Mesh)
→ Material: 원래 머티리얼
```

#### 4단계: 블루프린트 배치 및 테스트
1. **Compile** 버튼 클릭
2. **Save** 버튼 클릭
3. BP_InteractiveCube를 레벨에 드래그
4. Play 모드에서 큐브에 접근하여 상호작용 테스트

### 고급 예제: 점프 패드
1. 새 블루프린트 생성: "BP_JumpPad"
2. Static Mesh: 평평한 플랫폼
3. Box Collision: 트리거 영역
4. 이벤트 그래프:
```
On Component Begin Overlap
→ Cast to Character
→ Launch Character (Launch Velocity: 0, 0, 1000)
```

### 학습 포인트
- 블루프린트는 코드 없이 로직 구현 가능
- 이벤트 기반 프로그래밍
- 컴포넌트 시스템으로 기능 조합
- 노드 기반 비주얼 스크립팅

---

## 다음 단계

### 추천 학습 경로

#### 1. 공식 문서 및 튜토리얼
- [언리얼 엔진 공식 문서](https://docs.unrealengine.com/5.0/ko/)
- [언리얼 온라인 러닝](https://www.unrealengine.com/ko/onlinelearning)
- YouTube: Unreal Engine 공식 채널

#### 2. 심화 주제
- **Materials & Shaders**: 머티리얼 에디터 마스터
- **Lighting & Rendering**: Lumen과 Nanite 활용
- **Animation**: 캐릭터 애니메이션 시스템
- **C++ Programming**: 고급 기능 구현
- **Multiplayer**: 네트워크 게임 개발
- **Optimization**: 성능 최적화 기법

#### 3. 프로젝트 아이디어
- **간단한 플랫포머 게임**: 점프와 장애물
- **인터랙티브 환경**: 문, 스위치, 엘리베이터
- **미니 RPG**: 인벤토리, 전투 시스템
- **건축 시각화**: 실내 인테리어 프로젝트
- **파티클 효과**: 불, 연기, 마법 효과

#### 4. 커뮤니티 리소스
- **Unreal Engine Forums**: 질문과 답변
- **Discord**: UE5 개발자 커뮤니티
- **Reddit**: r/unrealengine
- **마켓플레이스**: 무료 에셋과 프로젝트

### 중요 팁
1. **자주 저장하기**: Ctrl+S, Ctrl+Shift+S (모두 저장)
2. **버전 관리**: Git 또는 Perforce 사용 권장
3. **성능 모니터링**: Stat FPS, Stat Unit 명령어
4. **에러 해결**: Output Log 확인 습관
5. **실험하기**: 두려워하지 말고 다양한 시도

### 마치며
언리얼 엔진 5는 강력하지만 학습 곡선이 있습니다. 꾸준한 연습과 실험을 통해 점진적으로 실력을 향상시킬 수 있습니다. 작은 프로젝트부터 시작하여 점차 복잡한 프로젝트로 발전시켜 나가세요.

**Happy Creating! 🎮**