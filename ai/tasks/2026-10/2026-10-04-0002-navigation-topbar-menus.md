# 캐릭터 검색 후 상단 내비게이션 바(8대 메뉴) 구성

- **일자**: 2026-10-04
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
1. `C:\maple-info-app\ai\img\261004_01.jpg` 이미지 파일 내용 판독
2. 메인 화면에서 캐릭터명 입력 후 진입 시, 상단바(Navbar)에 해당 이미지에 명시된 8개 메뉴를 구성
3. 메뉴 선택에 따른 탭 전환 인터랙션 및 리액트 컴포넌트 구조화

## 2. 계획 (plan)
1. `view_file` 도구를 활용하여 `261004_01.jpg`의 메뉴 텍스트 8개 식별
   - 캐릭터 정보 조회, 유니온 정보 조회, 길드 정보 조회, 연무장 정보 조회, 확률 정보 조회, 스케줄러 정보 조회, 랭킹 정보 조회, 공지 정보 조회
2. 내비게이션 상수 및 타입 정의 (`src/types/navigation.ts`)
3. 재사용 가능한 리액트 컴포넌트 분리:
   - `CharacterSearch`: 초기 검색 랜딩 화면
   - `Navbar`: 상단 로고, 현재 조회 캐릭터 표시, 8개 메뉴 탭 내비게이션
   - `TabContent`: 선택된 메뉴 탭에 따른 본문 콘텐츠 영역
4. `src/App.tsx`에서 상태(`characterName`, `activeMenu`)를 관리하고 화면 전환 제어
5. `pnpm lint` 및 `pnpm build`를 통해 타입 안정성 및 번들링 무결성 검증

## 3. 실행 내역 (execution)
- **생성된 파일**:
  - `src/types/navigation.ts`: 이미지에서 추출한 8대 메뉴 항목 상수(`MENU_ITEMS`) 및 유니온 타입(`MenuId`) 선언
  - `src/components/Navbar.tsx`: 반응형 스크롤 지원 상단바 및 8개 메뉴 버튼 UI
  - `src/components/CharacterSearch.tsx`: 검색 폼 및 추천 검색어 컴포넌트 분리
  - `src/components/TabContent.tsx`: 탭별 상세 화면 뷰 (캐릭터 프로필 카드 플레이스홀더 포함)
- **수정된 파일**:
  - `src/App.tsx`: 진입 여부에 따른 조건부 렌더링 및 탭 상태 연동
- **기록 파일**:
  - `ai/tasks/2026-10/2026-10-04-navigation-topbar-menus.md`: 작업 내역 문서화

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음 (모든 컴포넌트 타입 지정 및 Tailwind v4 유틸리티 클래스가 정상 컴파일됨)

## 5. 검증 (validation)
1. **이미지 판독 검증**: 8개 메뉴 텍스트 완전 일치 확인
2. **린트 검사**: `pnpm lint` (Oxlint) 0 warning, 0 error 통과
3. **타입 및 빌드 검증**: `pnpm build` (`tsc -b && vite build`) 668ms 번들링 성공

## 6. 남은 할 일 (todo)
- [ ] 메이플 오픈 API (`/maplestory/v1/id`) 호출로 OCID 연동
- [ ] `QueryClientProvider` 설정 및 TanStack Query 커스텀 훅 작성 (`useCharacterInfo` 등)
- [ ] 각 탭(유니온, 길드, 랭킹 등)별 넥슨 API 엔드포인트 연동 계획 수립

## 7. 교훈 (lessons)
- 메인 화면과 상세 화면을 컴포넌트 단위로 분리(`CharacterSearch`, `Navbar`, `TabContent`)함으로써 단일 책임 원칙(SRP)을 지키고, 리액트 상태 끌어올리기(Lifting State Up) 패턴을 명확히 구현할 수 있음.
- Tailwind CSS v4의 `overflow-x-auto whitespace-nowrap`을 활용하여 모바일 등 좁은 화면에서도 8개 탭 메뉴가 깨짐 없이 깔끔하게 스크롤되도록 처리함.
