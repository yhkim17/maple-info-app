# 다중 캐릭터 콤마 구분 주간 보스 클리어 현황 대시보드 UI 구현

- **일자**: 2026-10-05
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 스케줄러 정보 조회(`scheduler/character-state` 및 `custom/boss-tracker`) 시, 캐릭터명을 N개(예: `ColdZone, BishopZone` 등 콤마 구분) 입력할 수 있도록 폼을 개선.
- 캐릭터마다 주간 보스(`boss_weekly`) 목록을 UI에 한눈에 직관적으로 리스트업하고, 클리어한 보스(GREEN CLEAR)와 아직 클리어하지 않은 보스(RED NOT CLEARED)를 대비할 수 있는 전용 시각화 대시보드를 구축.

## 2. 계획 (plan)
1. **타입 정의 확장 (`src/types/mapleApi.ts`)**:
   - `SchedulerContentItem` 및 `CharacterSchedulerStateInfo` 인터페이스 정의.
2. **`TabContent.tsx` 파라미터 조절 폼 파이프라인 연동**:
   - `scheduler/character-state` 및 `custom/boss-tracker` 조회 시 다중 캐릭터 입력 인풋(`multiCharNames`) 렌더링 및 `queryParams.character_names` 바인딩.
3. **`ApiDataViewer.tsx` 시각화 렌더러 (`SchedulerStateVisual`) 구현**:
   - N개 캐릭터 닉네임 콤마 분리 파싱.
   - 전체 주간 보스 클리어 통계(클리어율, 예상 결정석 정산 메소액) 카운터 제공.
   - **뷰 모드 2종 제공**:
     - ① `🎴 캐릭터별 카드 뷰 (Cards View)`: 캐릭터별 클리어 프로그레스 바 & 보스별 클리어/미클리어 뱃지 표시.
     - ② `📊 한눈에 보는 비교 표 (Matrix Table View)`: 세로(보스) x 가로(캐릭터) 행렬 비교 표로 한눈에 완료/미완료 파악.
4. **검증**: `pnpm build`를 통합 검증.

## 3. 실행 내역 (execution)
- **`src/types/mapleApi.ts`**: `SchedulerContentItem`, `CharacterSchedulerStateInfo` 작성.
- **`src/components/TabContent.tsx`**: 다중 캐릭터 콤마 구분 입력창 추가.
- **`src/components/ApiDataViewer.tsx`**: `SchedulerStateVisual` 시각화 컴포넌트 추가 및 라우팅 연동.

## 4. 에러/트러블슈팅 (errors)
- `mapleApi.ts` 내 인터페이스 중복 닫는 괄호 Syntax Error 발생 → 괄호 정상 교정 후 빌드 재검증 통과.

## 5. 검증 (validation)
- `pnpm build`: TypeScript 타입 검사 및 Vite 프로덕션 빌드 성공 (`built in 681ms`).

## 6. 남은 할 일 (todo)
- 실제 넥슨 API 키를 이용해 N개 캐릭터에 대해 각각 `ocid`를 병렬 조회(`Promise.all`)하여 실제 넥슨 주간 보스 클리어 응답 데이터를 융합하는 실시간 멀티 쿼리 모듈 고도화.

## 7. 교훈 (lessons)
- 주간 보스돌이를 즐기는 메이플 유저 특성을 고려하여 캐릭터별 카드 뷰와 매트릭스 비교 표 2가지 뷰 모드를 함께 제공함으로써 압도적인 가시성과 사용자 경험(UX)을 확보할 수 있음.
