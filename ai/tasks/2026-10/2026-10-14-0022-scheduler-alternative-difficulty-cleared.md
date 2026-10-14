# 스케줄러 등록 난이도 외 타 난이도 클리어 시 완료 처리 및 UI 표기 개선

- **일자**: 2026-10-14
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 캐릭터 스케줄러 정보 조회(`/scheduler/character-state`) 시, 스케줄러에 등록된 난이도(예: `선택받은 세렌 normal`)가 아닌 다른 난이도(예: `hard`)로 클리어한 경우에도 UI 상에서 해당 보스를 "완료"로 정상 표시하도록 개선.
- 요약: 인게임 스케줄러에 등록된 난이도와 실제 처치한 난이도가 서로 다르더라도, 해당 주간 보스를 클리어했다면 완료(`cleared: true`)로 바인딩하여 유저에게 정확한 주간 숙제 현황을 전달.

## 2. 계획 (plan)
1. **데이터 연산 로직 분석 및 설계**:
   - 넥슨 Open API `scheduler/character-state`의 `boss_contents` 응답 구조 파악:
     - 예: 노멀 세렌(`registration_flag: "true"`, `complete_flag: "false"`)
     - 예: 하드 세렌(`registration_flag: "false"`, `complete_flag: "true"`)
   - `registration_flag === 'true'`로 등록된 주간 보스(`b`)에 대해:
     1) 자체 `complete_flag === 'true'` 여부 확인 (직접 클리어).
     2) 전체 `rawBossWeekly` 중 동일 보스명(`content_name`) 및 주간 주기(`cycle === 'bossWeekly'`)를 갖는 항목 중 `complete_flag === 'true'`인 항목(대체 난이도 클리어) 탐색.
     3) 두 조건 중 하나라도 만족 시 `cleared: true`로 판정.
     4) 타 난이도로 클리어한 경우 `clearedOtherDifficulty`에 해당 난이도(예: `HARD`)를 보관.
2. **결정석 보상 및 UI 표기 최적화**:
   - 보상 메소: 타 난이도로 클리어한 경우 실제 처치한 난이도의 결정석 시세(`getEstimatedWeeklyBossMeso`)를 반영하여 대시보드 합산 메소의 정합성 향상.
   - 카드 뷰: `[NORMAL]` 등록 뱃지 옆에 `[✨ HARD 클리어]` 뱃지를 추가하여 등록 난이도와 실제 클리어 난이도의 차이를 한눈에 식별할 수 있도록 지원.
   - 비교 표(Matrix View): `CLEAR` 상태 뱃지 아래에 실제 클리어된 난이도 `(HARD)`를 부가 표기.
3. **타입 정의 및 코드 검증**:
   - `SchedulerContentItem` 인터페이스에 `cycle`, `complete_flag`, `clearedOtherDifficulty`, `list_order_no` 확장.
   - `pnpm lint` (Oxlint 0 errors) 및 `pnpm build` (TypeScript/Vite 빌드) 검증.

## 3. 실행 내역 (execution)
- **`src/types/mapleApi.ts`**:
  - `SchedulerContentItem` 인터페이스에 `cycle`, `complete_flag`, `clearedOtherDifficulty`, `list_order_no` 필드 추가.
- **`src/components/ApiDataViewer.tsx`**:
  - `getEstimatedWeeklyBossMeso`: 스우(NORMAL), 데미안(NORMAL), 세렌(EXTREME), 칼로스/카링(추가 난이도), 림보(NORMAL/HARD) 등 가격 맵 보완.
  - `SchedulerStateVisual`:
    - `rawData` 메모이제이션 및 렌더링 중 불필요한 `new Date()` 호출 정리로 Oxlint 경고 해소.
    - `normalizeBossName` 함수를 도입하여 보스명 정규화 매칭 수행.
    - 동일 주간 보스의 타 난이도 `complete_flag === 'true'` 탐색 로직(`clearedAlternative`) 구현.
    - 타 난이도 클리어 시 실제 클리어 난이도 결정석 메소 적용 및 `clearedOtherDifficulty` 필드 설정.
    - 카드 뷰 및 Matrix Table 뷰에 `clearedOtherDifficulty` 뱃지 및 상태 표기 추가.

## 4. 에러/트러블슈팅 (errors)
- **Oxlint Purity 경고**: `new Date().toISOString()` 및 `rawData` useMemo 의존성 관련 경고가 발생했으나, `data` 기준 메모이제이션(`useMemo`) 및 기본값 정리를 통해 경고 0건으로 정비 완료.

## 5. 검증 (validation)
1. **단위 테스트 스크립트 실행 검증**:
   - 입력 데이터(세렌 normal 등록 / hard 클리어 / extreme 미완료) 시뮬레이션:
     - 결과: `name: '선택받은 세렌'`, `difficulty: 'NORMAL'`, `cleared: true`, `clearedOtherDifficulty: 'HARD'` 정상 도출 확인.
2. **코드 린트 검증**: `pnpm lint` 수행 결과 에러 0건 (Oxlint 검사 통과).
3. **프로덕션 빌드 검증**: `pnpm build` (`tsc -b && vite build`) 정상 통과 (`built in 684ms`).

## 6. 남은 할 일 (todo)
- [ ] 신규 최상위 보스(카르시온/그란디스 등) 출시에 맞춘 보스 결정석 시세 업데이트 옵션 고려.

## 7. 교훈 (lessons)
- 메이플스토리 인게임 주간 보스는 난이도와 무관하게 캐릭터당 주 1회만 처치할 수 있는 공유 카운트 메커니즘을 가집니다. 따라서 인게임 스케줄러 등록 항목의 `complete_flag`만 단편적으로 확인하지 않고, 동일 보스명의 전체 난이도 처치 여부를 교차 검증해야 유저의 실제 클리어 현황과 정확히 일치하는 직관적인 UX를 제공할 수 있습니다.
