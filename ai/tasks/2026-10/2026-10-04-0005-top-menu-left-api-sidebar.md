# 상단 메뉴 선택 시 세부 호출 API 목록 좌측 사이드바 연동

- **일자**: 2026-10-04
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 상단 8대 대분류 메뉴(`캐릭터 정보 조회`, `유니온 정보 조회`, `길드 정보 조회`, `연무장 정보 조회`, `확률 정보 조회`, `스케줄러 정보 조회`, `랭킹 정보 조회`, `공지 정보 조회`) 클릭 시, 해당 메뉴에 속하는 넥슨 메이플스토리 오픈 API 상세 호출 목록을 왼쪽 사이드바(Left Menu)로 구성
- 좌측 세부 API 메뉴 클릭 시 우측 메인 뷰에서 해당 API의 엔드포인트 URL, HTTP 메서드, 파라미터 요구사항(현재 캐릭터의 OCID 연계), API 설명 등을 직관적으로 확인할 수 있도록 화면 레이아웃 고도화

## 2. 계획 (plan)
1. **API 목록 데이터 및 타입 정의**:
   - `src/types/navigation.ts`: `SubApiMenuItem` 인터페이스 정의 (명칭, 엔드포인트, HTTP 메서드, 파라미터 요구사항, 태그 등) 및 상단 메뉴 메타데이터 확장
   - `src/constants/apiMenus.ts`: 8대 상단 메뉴별 넥슨 공식 API 엔드포인트(캐릭터 18개, 유니온 3개, 길드 2개, 연무장 2개, 확률 3개, 스케줄러 3개, 랭킹 6개, 공지 4개 등 총 40여 개 상세 API) 목록 상수 구성
2. **좌측 사이드바 컴포넌트 개발 (`LeftSidebar.tsx`)**:
   - 현재 선택된 상단 메뉴의 타이틀, 설명, 등록된 API 개수 뱃지 표시
   - 실시간 API 명칭/엔드포인트 검색 필터 기능 제공
   - 각 API 아이템별 HTTP 메서드(`GET`), 태그(스펙, 장비, 스킬 등), 엔드포인트 경로 시각화
   - 액티브 상태 하이라이트 및 모바일 오버레이/반응형 지원
3. **우측 본문 뷰 개선 (`TabContent.tsx`)**:
   - 현재 선택된 하위 API의 상세 스펙 카드, 전체 호출 URL, 파라미터 테이블(ocid, date 등과 현재 캐릭터 값 매핑), 연동 가이드 제공
   - 모바일 환경을 위한 좌측 API 목록 토글 버튼 추가
4. **상태 관리 및 레이아웃 통합 (`src/App.tsx`, `Navbar.tsx`)**:
   - 상단 메뉴 선택 시 해당 메뉴의 첫 번째 서브 API로 자동 전환되는 상태 관리 로직 구현
   - 좌우 2단 분할 레이아웃 적용 및 반응형 대응

## 3. 실행 내역 (execution)
- **생성된 파일**:
  - `src/constants/apiMenus.ts`: 8대 대분류별 상세 넥슨 오픈 API 메타데이터 목록 정의
  - `src/components/LeftSidebar.tsx`: 검색 필터 및 반응형을 지원하는 좌측 API 서브메뉴 컴포넌트
- **수정된 파일**:
  - `src/types/navigation.ts`: `SubApiMenuItem` 인터페이스 및 메뉴 아이콘/설명 필드 추가
  - `src/components/Navbar.tsx`: 메뉴 탭에 이모지 아이콘 적용
  - `src/components/TabContent.tsx`: 상세 API 스펙/파라미터/요청 URL 뷰어로 UI 개편
  - `src/App.tsx`: 상단 메뉴와 좌측 API 사이드바 간 상태 동기화 및 2단 분할 레이아웃 배치
- **기록 파일**:
  - `ai/tasks/2026-10/2026-10-04-0005-top-menu-left-api-sidebar.md`: 작업 내역 문서화

## 4. 에러/트러블슈팅 (errors)
- **에러**: `src/App.tsx`에서 `LeftSidebar`에 전달하는 prop에 `activeSubApi?.id`를 참조하려다 `currentSubApi` 변수명과의 불일치로 TypeScript 에러(`TS2552: Cannot find name 'activeSubApi'`) 발생
- **해결**: 이미 상태로 관리되고 있는 `activeSubApiId`를 직접 전달하도록 수정하여 컴파일 오류 해결

## 5. 검증 (validation)
1. **린트 검사**: `pnpm lint` (Oxlint) 실행 -> 14개 파일 대상 0 warning, 0 error 통과
2. **타입 및 빌드 검증**: `pnpm build` (`tsc -b && vite build`) 실행 -> 742ms 만에 번들링 성공 및 타입 무결성 검증 완료

## 6. 남은 할 일 (todo)
- [ ] 선택된 서브 API(예: `character/basic`, `character/stat` 등)의 실제 넥슨 Open API 데이터 호출 커스텀 훅(`useQuery`) 연동
- [ ] API 호출 결과를 보여줄 직관적인 캐릭터 정보 UI 컴포넌트(장비 슬롯 뷰, 스탯표, 스킬 트리 등) 구현
- [ ] 호출 이력 및 API 응답 JSON 원본 뷰어 탭 추가

## 7. 교훈 (lessons)
- 상단 대분류(GNB)와 좌측 상세 메뉴(LNB)를 체계적으로 분리 설계함으로써, 넥슨 오픈 API의 40여 개가 넘는 방대한 엔드포인트를 사용자가 직관적으로 탐색하고 이해하기 쉬운 정보 구조(Information Architecture)를 완성함.
- 대메뉴 전환 시 하위 메뉴의 첫 번째 항목을 자동 선택(`SUB_API_MENUS[menuId]?.[0]`)하도록 상태를 동기화하여 빈 화면이 노출되지 않도록 사용자 경험(UX)을 배려함.
