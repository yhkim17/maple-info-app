# custom/boss-tracker 파라미터 및 Mock 데이터 확인/개선

- **일자**: 2026-10-05
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- `custom/boss-tracker` (주간 보스 클리어 현황) 요청 시 `date` 파라미터가 포함되어 전달되고 있는지 확인.
- 어떤 캐릭터를 조회하든 결과 데이터가 동일하게 표시되는 원인 분석 및 필요 시 파라미터 전달 로직 보완.

## 2. 계획 (plan)
1. `src/constants/apiMenus.ts`에서 `scheduler-boss` 엔드포인트 파라미터 정의 상태 확인.
2. `src/api/index.ts`에서 `custom/boss-tracker` 로직(`mockCustomData`) 분석.
3. `scheduler-boss` 파라미터 목록에 `date` (`YYYY-MM-DD`) 옵션 파라미터를 추가하고 `mockCustomData`에서 `date` 수신 및 응답 반환 로직 반영.
4. `pnpm build`를 통한 타입 검사 및 빌드 검증.

## 3. 실행 내역 (execution)
- **`src/constants/apiMenus.ts`**:
  - `scheduler-boss` 파라미터 항목에 `date` (`required: false`) 파라미터 정의 추가.
- **`src/api/index.ts`**:
  - `mockCustomData` 함수 내 `boss-tracker` 처리 부분에 `date: params?.date` 응답 필드 반영.

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음.

## 5. 검증 (validation)
- `pnpm build`: TypeScript 타입 체크 및 Vite 프로덕션 빌드 성공적으로 통과 (`vite v8.3.2 built in 1.12s`).

## 6. 남은 할 일 (todo)
- 향후 주간 보스 클리어 현황에 캐릭터별/날짜별 클리어 여부를 로컬스토리지 또는 사용자 커스텀 상태로 저장/토글할 수 있는 인터랙티브 UI 기능 확장 고려.

## 7. 교훈 (lessons)
- 커스텀 시뮬레이션 엔드포인트(`custom/*`)의 경우 파라미터 정의(`apiMenus.ts`)와 핸들러(`mockCustomData`)가 일치해야 UI UI 폼 입력 필드 노출 및 파라미터 수신이 정상적으로 연결됨.
