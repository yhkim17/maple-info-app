# 주간 보스(bossWeekly) 등록(registration_flag=true) 리스트 필터링 및 완료/미완료 표시 구현

- **일자**: 2026-10-10
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
1. `boss_contents` 내에서 `registration_flag`가 `'true'`인 리스트만 카운트 및 조회.
2. `bossWeekly` 목록만 불러오고, `bossMonthly`(검은 마법사 등) 및 `bossDaily`는 제외.
3. `complete_flag`가 `'true'`이면 "완료", `'false'`이면 "미완료"로 시각화 뷰에 표시.

## 2. 계획 (plan)
1. **데이터 추출 조건 확정**:
   - 넥슨 Open API `scheduler/character-state` 응답의 `boss_contents` 배열에서:
     - `b.cycle === 'bossWeekly'` (주간 보스만 한정, 월간 `bossMonthly`와 일간 `bossDaily` 제외).
     - `b.registration_flag === 'true'` (인게임 스케줄러에 유저가 등록/체크해 둔 보스만 선별).
     - `b.complete_flag === 'true'` -> 완료(`cleared: true`), `'false'` -> 미완료(`cleared: false`).
2. **시각화 뷰어 (`src/components/ApiDataViewer.tsx`) 적용**:
   - `SchedulerStateVisual` 컴포넌트의 캐릭터별 보스 리스트(`charBossDataList`) 생성 로직을 개선:
     - 위 조건에 부합하는 `registeredWeeklyBosses` 목록을 추출하여 각 캐릭터의 보스 카드 목록으로 렌더링.
     - 각 보스의 결정석 예상 메소 가격 매핑 함수(`getEstimatedWeeklyBossMeso`) 적용.
   - 한눈에 비교 표(Matrix View)에서도 등록된 주간 보스 목록(`matrixBossList`)을 동적으로 구성하여 테이블 행(Row)으로 매핑.
3. **검증**:
   - `pnpm lint` 및 `pnpm build`를 통한 타입/구문 검증.
   - 실제 넥슨 Open API 데이터(ColdZone 21개 등록 / 8개 완료, BishopZone 19개 등록 / 11개 완료) 연동 확인.

## 3. 실행 내역 (execution)
- **`src/components/ApiDataViewer.tsx`**:
  - `getEstimatedWeeklyBossMeso`: 주간 보스 난이도별 최신 결정석 가격 추정 헬퍼 함수 추가.
  - `SchedulerStateVisual`:
    - `rawBossWeekly.filter`에 `cycle === 'bossWeekly'` 및 `registration_flag === 'true'` 조건 적용.
    - `complete_flag === 'true'` 여부를 `cleared` 불리언 값으로 바인딩하여 "완료(✓)"와 "미완료(✕)" 뱃지 표시.
    - `matrixBossList`를 통해 동적 매트릭스 표 행 구성 및 캐릭터별 보스 상태 정밀 매칭.

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음.

## 5. 검증 (validation)
1. `pnpm lint`: Oxlint 검사 통과 (0 error).
2. `pnpm build`: `tsc -b && vite build` 프로덕션 빌드 성공 (`built in 968ms`).
3. 실제 API 데이터 검증:
   - `ColdZone`: 21개 주간 보스 등록, 8개 완료 (스우, 데미안, 진힐라, 듄켈, 세렌, 칼로스, 카링, 대적자).
   - `BishopZone`: 19개 주간 보스 등록, 11개 완료 (월간 검은 마법사는 요구사항에 따라 완벽히 제외됨).

## 6. 남은 할 일 (todo)
- [ ] 난이도별 결정석 메소 정산액을 공식 패치 주기별로 동기화할 수 있는 설정 옵션 추가 고려.

## 7. 교훈 (lessons)
- 인게임 스케줄러 기능은 유저가 실제로 진행할 보스만 `registration_flag`로 등록해 두고 관리하므로, 전체 54개 주간 보스를 나열하는 것보다 등록된 보스만 필터링하여 제공할 때 사용자 경험과 실용성이 극대화됨.
