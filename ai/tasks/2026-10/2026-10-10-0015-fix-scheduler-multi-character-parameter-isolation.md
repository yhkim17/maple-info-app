# 캐릭터 스케줄러(scheduler/character-state) 다중 파라미터 격리 및 타 메뉴 단일 파라미터 호출 에러 수정

- **일자**: 2026-10-10
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- `scheduler/character-state` 호출 시 N개의 캐릭터를 파라미터로 넘기도록 변경한 이후, 다른 메뉴 API 호출 시 파라미터가 잘못 전달되어 에러(`OPENAPI00004: Please input valid parameter`)가 발생하는 문제를 해결.
- `character-state` 호출 시에만 N개의 다중 캐릭터(`character_names`)를 파라미터로 넘기며, 다른 모든 메뉴 및 엔드포인트는 기존 방식대로 1개의 캐릭터(`ocid`, `character_name` 등)만 단일 파라미터로 안전하게 넘기도록 격리하여 오류를 방지.

## 2. 계획 (plan)
1. **에러 원인 분석**:
   - `TabContent.tsx`에서 기준일 상태(`selectedDate`) 초기값이 오늘 날짜(`getTodayString()`)로 지정되어 있어, 다른 메뉴(캐릭터 기본 정보 `character/basic`, 종합 능력치 `character/stat`, 유니온 등)로 이동했을 때도 `date=YYYY-MM-DD`가 강제 포함됨.
   - 넥슨 Open API는 캐릭터 기본 정보 조회 시 당일 날짜를 전송하면 `OPENAPI00004` (Please input valid parameter) 400 Bad Request 에러를 반환하며, `date`를 생략해야 최신 데이터를 반환함.
   - 또한, `TabContent.tsx`에서 `scheduler/character-state`뿐만 아니라 `custom/boss-tracker` 등에도 `params.character_names`가 설정되고 있었으며, 넥슨 API 호출 시 가상/프론트엔드 전용 파라미터가 쿼리스트링에 포함될 경우 넥슨 서버에서 파라미터 유효성 검사 에러를 유발할 수 있음.
   - `src/api/index.ts`의 `fetchMultiCharacterSchedulerState`에서 `ocid` 조회를 위한 엔드포인트가 공식 스펙인 `id`가 아닌 `character/id`(403 Forbidden)로 잘못 호출되어 있던 점도 확인.
2. **다중 캐릭터 파라미터 격리 및 조건부 적용**:
   - `TabContent.tsx`:
     - `selectedDate`의 기본값을 빈 문자열(`''`)로 복원하여 사용자가 날짜를 지정하지 않았을 때 다른 API에 불필요한 `date` 파라미터가 날아가지 않도록 차단 (이력 API `history/*`만 당일 디폴트 보장).
     - `params.character_names` 할당 조건을 오직 `activeSubApi.endpoint === 'scheduler/character-state'`로 엄격히 한정.
     - 다중 캐릭터 입력창 UI 역시 `scheduler/character-state`에서만 노출되도록 제한.
3. **넥슨 API 요청 파라미터 정제 (Sanitization) 및 단일/다중 처리 고도화**:
   - `src/api/index.ts`:
     - `fetchNexonApi`: `scheduler/character-state`에 대해 1개 또는 N개 캐릭터 모두 `fetchMultiCharacterSchedulerState`를 안전하게 타도록 처리하고, 그 외 넥슨 API 호출 시 `character_names` 등 넥슨 규격 외 파라미터 및 빈 값을 제거한 `sanitizedParams`만 전달.
     - `fetchMultiCharacterSchedulerState`: 캐릭터 식별자 조회 경로를 공식 엔드포인트인 `'id'`로 수정하고, `date`가 비어있을 때는 파라미터를 생략하여 안전하게 호출하도록 수정.
4. **검증**:
   - `pnpm lint` 및 `pnpm build` 수행.
   - node 스크립트를 통한 실제 넥슨 Open API 응답(단일 캐릭터 조회 및 다중 캐릭터 스케줄러 조회) 200 OK 검증.

## 3. 실행 내역 (execution)
- **`src/components/TabContent.tsx`**:
  - `selectedDate` 초기값을 `''`로 변경하여 다른 메뉴 API에 오늘 날짜가 강제 전달되지 않도록 수정.
  - `params.character_names` 바인딩 조건을 오직 `activeSubApi.endpoint === 'scheduler/character-state'`로 제한.
  - 다중 캐릭터(콤마 구분) 입력 인풋 UI 노출 조건을 `scheduler/character-state` 전용으로 한정.
- **`src/api/index.ts`**:
  - `fetchNexonApi`에서 넥슨 공식 API 호출 전 `character_names` 제거 및 `sanitizedParams` 전달 로직 추가.
  - `fetchMultiCharacterSchedulerState`의 캐릭터 OCID 조회 API 엔드포인트를 `character/id`에서 `id`로 올바르게 수정.
  - `date`가 빈 문자열일 때 파라미터를 생략하도록 보완.
- **`src/components/ApiDataViewer.tsx`**:
  - `SchedulerStateVisual`의 주간 보스 클리어 판정 로직에 넥슨 실제 응답 스펙인 `matched.complete_flag === 'true'`를 반영.

## 4. 에러/트러블슈팅 (errors)
- **에러 현상**:
  - 캐릭터 기본 정보(`character/basic`)나 스탯 정보 등 다른 메뉴 조회 시 `400 Bad Request` (`OPENAPI00004: Please input valid parameter`) 에러 발생.
- **원인 분석**:
  1. `selectedDate`가 당일(`2026-10-10`)로 기본 채워져 있어 모든 API에 `date`가 전달됨 (넥슨 캐릭터 API는 당일 데이터 조회 시 400 에러를 반환하며, 파라미터를 생략해야 최신 데이터를 반환함).
  2. 넥슨 API 쿼리에 규격 외 프론트엔드 파라미터(`character_names`)가 전달될 경우 파라미터 에러 발생.
- **해결**:
  1. `selectedDate` 초기값을 빈 문자열로 되돌리고, 필수인 `history/*` 외에는 날짜 미입력 시 `date` 파라미터를 완전히 생략.
  2. 넥슨 API 요청 직전 `sanitizedParams`를 통해 프론트엔드 전용 파라미터를 제거.
  3. `scheduler/character-state`에서만 `character_names`를 처리하도록 철저히 분기 및 격리.

## 5. 검증 (validation)
1. **정적 검사 및 빌드**:
   - `pnpm lint`: Oxlint 17개 파일 0 에러 통과.
   - `pnpm build`: `tsc -b && vite build` 정상 빌드 완료 (791ms).
2. **실제 API 통신 테스트**:
   - 단일 캐릭터(`ColdZone`)의 `character/basic` 호출: `date` 파라미터 생략 시 `200 OK` 정상 데이터 반환 확인.
   - 다중 캐릭터(`ColdZone, BishopZone, ChIlliumZone, ChBeMeZone`)의 `scheduler/character-state` 호출: `id` 엔드포인트 정상 연동 후 4개 캐릭터 모두 주간 보스 정보 `200 OK` 반환 확인.

## 6. 남은 할 일 (todo)
- [ ] 다른 탭 이동 시 사용자가 입력했던 다중 캐릭터 목록 상태를 로컬스토리지에 저장하여 탭 전환 후 복귀 시에도 유지되도록 UX 편의성 개선 고려.

## 7. 교훈 (lessons)
- 특정 엔드포인트(예: `scheduler/character-state`) 전용으로 도입한 커스텀 파라미터나 상태(기본 날짜 등)가 상위/공통 컴포넌트(`TabContent`)에서 전역적으로 공유될 경우, 다른 메뉴의 일반 API 호출에 부작용(Side Effect)을 일으킬 수 있음.
- 백엔드/외부 API 요청 파라미터는 전송 직전에 화이트리스트 기반 또는 규격 외 파라미터 필터링(`sanitizedParams`)을 수행하고, 화면별로 필요한 파라미터는 엔드포인트 조건을 명시적으로 격리해야 안정성을 보장할 수 있음.
