# 넥슨 공식 캐릭터 스케줄러 정보 조회 API (scheduler/character-state) 엔드포인트 연동

- **일자**: 2026-10-05
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 사용자가 전달한 넥슨 OpenAPI 공식 문서 스크린샷에 기반하여, 캐릭터 스케줄러 정보 조회 API URL인 `scheduler/character-state` 및 요청 파라미터(`ocid` 필수, `date` 옵션)를 확인하고 메뉴에 정식 반영.

## 2. 계획 (plan)
1. 넥슨 OpenAPI 스케줄러 명세 확인:
   - 엔드포인트: `GET /maplestory/v1/scheduler/character-state`
   - 파라미터: `ocid` (필수, query), `date` (옵션, query: `YYYY-MM-DD`, 미입력 시 오늘 날짜)
2. `src/constants/apiMenus.ts`의 `scheduler` 카테고리 메뉴 수정:
   - 공식 API인 `scheduler/character-state` ("캐릭터 스케줄러 정보 조회")를 첫 번째 대표 엔드포인트로 배치.
   - 기존 로컬 시뮬레이션 항목(`custom/boss-tracker`, `custom/quest-tracker`)은 로컬 가상 태그로 명확히 분류 구분.
3. `pnpm build`를 통한 검증.

## 3. 실행 내역 (execution)
- **`src/constants/apiMenus.ts`**:
  - `scheduler` 카테고리 내 `id: 'scheduler-character-state'` 항목 추가.
  - 엔드포인트: `scheduler/character-state`, 파라미터: `ocid` (필수), `date` (옵션).

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음.

## 5. 검증 (validation)
- `pnpm build`: TypeScript 타입 검사 및 Vite 생산 빌드 정상 성공 (`built in 643ms`).

## 6. 남은 할 일 (todo)
- `scheduler/character-state` API의 실제 넥슨 응답 구조에 맞춘 시각화 UI 컴포넌트 뷰 추가 확장.

## 7. 교훈 (lessons)
- 커스텀/시뮬레이션 용도로 작성해 둔 가상 엔드포인트와 넥슨 공식 OpenAPI 엔드포인트를 명확히 명칭과 태그로 구분함으로써 사용자 혼선을 줄일 수 있음.
