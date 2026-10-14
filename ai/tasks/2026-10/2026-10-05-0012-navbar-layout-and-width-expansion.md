# 상단 헤더(Navbar) 1단 레이아웃 개편 및 화면 전체 너비 확장

- **일자**: 2026-10-05
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 상단 메이플 인포 로고를 8대 대메뉴 탭 좌측으로 배치하고, '조회 중: {캐릭터} [캐릭터 변경]' 구역을 메뉴 우측으로 이동시켜 상단 메뉴바의 Height를 슬림한 1단 헤더(`h-14`)로 감축.
- 앱 전체 레이아웃의 컨테이너 폭(`max-w`) 제한을 대폭 확장(`max-w-[1920px]`, `max-w-none`)하여 좌우 여백을 줄이고 화면을 한눈에 시원하게 넓게 활용할 수 있도록 개편.

## 2. 계획 (plan)
1. **`Navbar.tsx` 구조 개선**:
   - 기존 2단 구성을 1개의 `flex` 단일 행(`h-14`) 헤더로 통합.
   - 좌측: `메이플 인포` 로고
   - 중앙: 8대 대메뉴 탭버튼 (가로 스크롤 및 콤팩트 패딩 적용)
   - 우측: `조회 중: {characterName}` 및 `[캐릭터 변경]` 버튼
2. **`LeftSidebar.tsx` 오프셋 조정**:
   - 상단 헤더 높이 축소(`56px`)에 맞춰 sticky position `top-28` → `top-14`, 높이 `h-[calc(100vh-7rem)]` → `h-[calc(100vh-3.5rem)]`로 조정.
3. **`App.tsx` & `TabContent.tsx` 폭 확장**:
   - `App.tsx` 레이아웃 컨테이너 `max-w-7xl` → `max-w-[1920px]`로 확장.
   - `TabContent.tsx`의 `<main>` 영역 `max-w-6xl` 해제(`max-w-none w-full min-w-0`).
4. **검증**: `pnpm build` 성공 여부 확인.

## 3. 실행 내역 (execution)
- **`src/components/Navbar.tsx`**:
  - 단일 행(`h-14`) `flex justify-between items-center` 레이아웃으로 변경.
- **`src/components/LeftSidebar.tsx`**:
  - `top-14`, `h-[calc(100vh-3.5rem)]` 반영.
- **`src/App.tsx`**:
  - `max-w-[1920px]` 적용.
- **`src/components/TabContent.tsx`**:
  - `max-w-6xl` 제거 후 `w-full min-w-0` 적용.

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음.

## 5. 검증 (validation)
- `pnpm build`: TypeScript 타입 체크 및 Vite 프로덕션 빌드 성공 (`built in 645ms`).

## 6. 남은 할 일 (todo)
- 초고해상도 디스플레이 모니터 사용 시에도 시각화 카드가 왜곡되지 않도록 반응형 그리드 뷰 지속 점검.

## 7. 교훈 (lessons)
- 상단 헤더를 1단 슬림 헤더로 압축하고 본문 max-width 제약을 완화하면 대화면 모니터 사용자 환경에서 공간 활용도가 크게 향상됨.
