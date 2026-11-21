# API 요청 컨트롤 바 헤더 상단 우측 여백 이동 및 뷰어 가시성 개선

- **일자**: 2026-11-22
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 상단 헤더와 메인 데이터 뷰어 사이에 독립적으로 넓은 수직 공간을 차지하던 API 요청 바(`GET /maplestory/v1/character/basic x-nxopen-api-key 연동`, `기준일(date)`, `API 호출 / 새로고침` 등)를 상단 헤더 우측의 빈 여백으로 이동.
- 불필요하게 낭비되던 세로 공간을 압축하여 하단의 핵심 콘텐츠(`시각화 뷰 / JSON 원본`, 캐릭터 기본 정보, 장비 스탯 등)가 스크롤 없이 한눈에 들어오도록 가시성을 극대화.

## 2. 계획 (plan)
1. **헤더 레이아웃 구조 개편 (`src/components/TabContent.tsx`)**:
   - 기존의 헤더 섹션(`mb-6 pb-5 border-b border-slate-800`)을 `flex-col xl:flex-row xl:items-start justify-between` 구조로 확장.
   - 좌측 영역: 브레드크럼, API 명칭, HTTP 메서드 뱃지, 설명 문구 배치.
   - 우측 영역: 상단 여백에 컴팩트한 엔드포인트 URL 바(`GET ... x-nxopen-api-key 연동`)와 파라미터 조절 폼(기준일 선택, 스킬 차수 등) 및 `API 호출 / 새로고침` 버튼을 2단 구조로 우측 정렬 배치.
2. **독립된 컨트롤 박스 컨테이너 제거**:
   - 기존 `bg-slate-900/80 rounded-2xl p-5 border border-slate-800` 박스와 `space-y-6` 래퍼를 걷어내고, 헤더 바로 아래에 `ApiDataViewer`가 곧바로 이어지도록 정리.
3. **Linter 경고 개선**:
   - `TabContent` 내부에서 매 렌더링마다 생성되던 `getTodayString` 함수를 컴포넌트 외부 스코프로 분리하여 React 19 컴파일러 / Oxlint purity 경고 원천 해결.
4. **검증**:
   - `tsc --noEmit`, `pnpm lint`, `pnpm build` 수행.

## 3. 실행 내역 (execution)
- **수정된 파일**:
  - `src/components/TabContent.tsx`:
    - `getTodayString` 함수를 컴포넌트 외부로 이동하여 순수 함수화 (0 warnings 달성).
    - 헤더 섹션을 `flex-col xl:flex-row xl:items-start justify-between gap-4`로 개편하여 우측 상단 여백에 엔드포인트 및 컨트롤 바를 컴팩트하게 통합.
    - 기존의 거대한 세로 박스 컨테이너를 삭제하고 `<ApiDataViewer />`를 상단으로 끌어올림.

## 4. 에러/트러블슈팅 (errors)
- **해당 사항 없음**: 반응형 브레이크포인트(`xl:`)와 flex 정렬을 적절히 적용하여 데스크톱 및 모바일 전 구간에서 레이아웃 깨짐 없이 원활하게 반영 완료.

## 5. 검증 (validation)
1. **타입 검사**: `pnpm exec tsc --noEmit` -> 통과 (에러 0건)
2. **린트 검사**: `pnpm lint` (Oxlint) -> 통과 (에러 0건, 경고 0건 클린)
3. **빌드 검증**: `pnpm build` (`tsc -b && vite build`) -> 성공 (855ms)

## 6. 남은 할 일 (todo)
- [ ] 브라우저에서 날짜 변경 및 API 새로고침 시 상단 우측 컨트롤 바의 동작 반응성 최종 확인

## 7. 교훈 (lessons)
- 대시보드 UI에서 메타데이터(API 엔드포인트, 인증 키 정보, 파라미터 제어)와 실제 비즈니스 데이터(캐릭터 스탯, 시각화 카드)가 상하로 과도하게 나열되면 시선이 분산되고 메인 콘텐츠의 스크롤 부담이 커집니다.
- 헤더 영역의 유휴 우측 여백을 활용하여 제어부를 컴팩트하게 밀착 배치함으로써 공간 효율성과 정보 가독성을 동시에 대폭 향상시킬 수 있습니다.
