# character-state 호출 시 캐릭터명 입력 중 실시간 API 호출 오류 수정 및 적용 분리

- **일자**: 2026-10-10
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- `scheduler/character-state` 메뉴에서 다중 캐릭터 인풋창에 캐릭터명을 타이핑/수정할 때 발생하는 실시간 API 호출 에러(`400 Bad Request`, `429 Too Many Requests`, 화면 깜빡임 및 크래시)를 해결.
- 입력 중에는 실시간 API 호출을 차단하고, 사용자가 입력을 마친 후 **엔터(Enter)** 키 또는 **[적용]** / **[API 호출 / 새로고침]** 버튼을 눌렀을 때만 안전하게 조회가 실행되도록 변경.
- 존재하지 않는 닉네임이나 본인 계정이 아닌 캐릭터명이 포함되었을 때도 전체 화면이 에러로 중단되지 않고 개별 카드에 직관적인 안내를 표시하도록 방어 로직 강화.

## 2. 계획 (plan)
1. **원인 분석**:
   - `TabContent.tsx`에서 다중 캐릭터 입력창의 `value`와 `onChange`가 쿼리 파라미터(`queryParams.character_names`)에 직접 실시간 바인딩되어 있었음.
   - 글자를 한 글자 칠 때마다(키스트로크마다) React Query가 새 쿼리를 즉시 실행하여, 미완성된 닉네임(예: `C`, `ColdZ`, 한글 자모 조합 등)으로 넥슨 OpenAPI(`id` 엔드포인트)에 수많은 요청이 난사됨.
   - 결과적으로 `400 Bad Request` 에러 발생 및 초당 5건 제한(`429 Too Many Requests`) 초과, 화면 재로딩 오류가 발생함.
2. **입력 상태(Input State)와 적용 상태(Applied State) 분리**:
   - `TabContent.tsx`:
     - 로컬 입력 상태 `multiCharNamesInput`과 쿼리에 전달되는 상태 `appliedMultiCharNames`를 분리.
     - 키보드 타이핑 시에는 오직 `multiCharNamesInput`만 변경되므로 불필요한 API 호출이 0건으로 완전 차단됨.
     - 인풋 엔터 키 이벤트(`onKeyDown`) 및 `적용` 버튼, 우측 `API 호출 / 새로고침` 클릭 시에만 `appliedMultiCharNames`를 갱신하고 쿼리 실행.
3. **에러 캐릭터 안전 격리 및 UI 안내 (`ApiDataViewer.tsx`, `api/index.ts`)**:
   - `fetchMultiCharacterSchedulerState`의 에러 응답 객체에 `boss_contents: []`를 명시하여 프론트엔드 연산 시 undefined 에러 방지.
   - `SchedulerStateVisual`: 개별 캐릭터 데이터에 `error`가 존재하는 경우 가상 클리어 데이터를 표시하지 않고, 해당 카드 내부에 "⚠️ 스케줄러 정보 조회 불가 (본인 계정 캐릭터만 조회 가능)" 경고 배너를 친절하게 안내.
4. **검증**:
   - `pnpm lint` 및 `pnpm build` 수행.

## 3. 실행 내역 (execution)
- **`src/components/TabContent.tsx`**:
  - `multiCharNamesInput` (입력용)과 `appliedMultiCharNames` (조회용) 분리.
  - `queryParams`가 `appliedMultiCharNames`만 구독하도록 수정.
  - 인풋 필드에 Enter 키 이벤트 핸들러 및 `적용` 버튼 추가, `API 호출 / 새로고침` 버튼과 적용 로직 동기화.
- **`src/api/index.ts`**:
  - `fetchMultiCharacterSchedulerState`의 실패 catch 및 null 반환 시 `boss_contents: []` 기본 속성 보강.
- **`src/components/ApiDataViewer.tsx`**:
  - `charBossDataList` 연산에서 개별 캐릭터의 `error` 필드를 식별하고 보스 목록/메소 수치를 안전하게 격리.
  - 카드 뷰 렌더링 시 `char.error`가 존재할 경우 사용자 친화적인 안내 배너 표시.

## 4. 에러/트러블슈팅 (errors)
- **에러 현상**:
  - 캐릭터명 타이핑 도중 넥슨 OpenAPI `400 Bad Request` 및 `429 Too Many Requests` 발생.
- **원인**:
  - `input`의 `onChange` 이벤트마다 `queryParams` 객체가 재생성되어 불완전한 캐릭터명으로 넥슨 API가 연속 호출됨.
- **해결**:
  - 인풋 상태와 API 파라미터 적용 상태를 명확히 분리하여 사용자가 조회를 의도(엔터 또는 버튼 클릭)할 때만 1회 호출되도록 교정.

## 5. 검증 (validation)
1. **린트 검사**: `pnpm lint` (Oxlint) 통과 (0 error).
2. **타입 체크 및 빌드**: `pnpm build` 성공 (`built in 858ms`).

## 6. 남은 할 일 (todo)
- [ ] 최근 조회한 다중 캐릭터 조합을 드롭다운이나 빠른 선택 칩 형태로 제공하는 편의 기능 검토.

## 7. 교훈 (lessons)
- 외부 API를 호출하는 쿼리 파라미터 입력창의 경우, `onChange`에 쿼리를 직접 연결하면 키스트로크마다 네트워크 요청이 발생하여 Quota 초과 및 유효하지 않은 파라미터 에러가 발생함.
- 반드시 입력 폼 상태(Local Input State)와 서버 요청 상태(Submitted/Applied State)를 분리하고 명시적인 트리거(Enter, 제출 버튼)를 통해 요청을 디스패치해야 안정적인 UX를 제공할 수 있음.
