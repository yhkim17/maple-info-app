# 캐릭터 스케줄러(scheduler/character-state) 주간 보스 목록 리스트 조회 조건 분석 및 넥슨 응답 필드 매핑

- **일자**: 2026-10-10
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- `scheduler/character-state` 호출 시 넥슨 Open API에서 제공하는 주간 보스 목록 리스트의 조회 조건(요청 파라미터 조건 및 응답 데이터 내 필터링 조건)을 상세 분석하고 정리.
- 대시보드 시각화 뷰어(`SchedulerStateVisual`)가 넥슨 공식 응답 필드(`boss_contents`, `cycle: 'bossWeekly' | 'bossMonthly'`, `complete_flag`)를 정확히 매핑하여 렌더링하도록 개선.

## 2. 계획 (plan)
1. **넥슨 OpenAPI `scheduler/character-state` 스펙 및 응답 분석**:
   - **요청 파라미터 (Request)**:
     - `ocid` (필수): 캐릭터 식별자 (본인 계정에 속한 캐릭터만 조회 가능).
     - `date` (선택): 조회 기준일 (`YYYY-MM-DD`, 최대 최근 14일 전까지 조회 가능, 미입력 시 최신 데이터 반환).
   - **응답 데이터 구조 (Response)**:
     - `weekly_boss_clear_count` (number): 이번 주 주간 보스 클리어 수치 (예: 8).
     - `weekly_boss_clear_limit_count` (number): 주간 보스 최대 클리어 가능 제한 수치 (12).
     - `boss_contents` (Array): 전체 보스 리스트 (일간/주간/월간 총 80여 개 항목).
   - **주간 보스 필터링 세부 조건**:
     - `cycle === 'bossWeekly'`: 주간 보스 항목 (총 54개).
     - `cycle === 'bossMonthly'`: 월간 보스 항목 (검은 마법사 등 2개).
     - `registration_flag === 'true'`: 인게임 스케줄러에 등록/체크된 보스.
     - `complete_flag === 'true'`: 이번 주 처치(클리어) 완료 여부.
2. **시각화 뷰어 매핑 보완**:
   - `src/components/ApiDataViewer.tsx` 내 `SchedulerStateVisual`에서 기존에 `boss_weekly`로 참조하던 부분을 실제 넥슨 키인 `boss_contents`로 바인딩하고, 보스명 및 난이도(`difficulty`)를 정밀 매칭하도록 수정.
3. **검증**:
   - `pnpm build` 수행 및 실제 API 응답 기반 정합성 확인.

## 3. 실행 내역 (execution)
- **`src/components/ApiDataViewer.tsx`**:
  - `SchedulerStateVisual`: `rawBossWeekly` 추출 시 `charSpecificData.boss_contents`를 1순위로 조회하도록 수정.
  - 보스 템플릿과 넥슨 응답 매칭 시 보스명(`content_name`) 및 난이도(`difficulty`, 예: HARD, CHAOS) 교차 비교 로직 적용.

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음 (사전 API 응답 구조 분석을 통해 잠재적 필드 미매칭 문제를 조기 개선).

## 5. 검증 (validation)
- `pnpm build`: TypeScript 타입 검사 및 Vite 빌드 정상 통과 (`built in 844ms`).
- 실제 넥슨 Open API ColdZone 계정 테스트:
  - `weekly_boss_clear_count`: 8
  - `boss_contents.filter(b => b.complete_flag === 'true')`: 정확히 8개 항목 매칭 확인 (스우, 데미안, 진 힐라, 듄켈, 세렌, 칼로스, 카링, 대적자).

## 6. 남은 할 일 (todo)
- [ ] 주간 보스 외에 일일/주간 숙제 탭(`daily_contents`, `weekly_contents`) 시각화 확장 지원 고려.

## 7. 교훈 (lessons)
- OpenAPI 공식 명세와 실제 반환되는 JSON의 필드명(`boss_contents`, `complete_flag`, `cycle`)을 직접 호출하여 정확히 대조함으로써 UI 시각화 데이터 누락을 사전에 방지할 수 있음.
