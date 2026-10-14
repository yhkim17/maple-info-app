# 다중 캐릭터 콤마 구분이 시각화에 반영되지 않던 문제 수정 및 기준일 오늘 날짜 디폴트 설정

- **일자**: 2026-10-05
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 다중 캐릭터 입력창에 `ColdZone, BishopZone`처럼 콤마 구분 캐릭터를 입력했을 때 시각화 UI에 1개 캐릭터만 출력되던 버그 수정.
- 기준일(`date`) 파라미터 미선택 시 `연도-월-일`로 비어 있지 않고 오늘 날짜(`YYYY-MM-DD`, 예: `2026-10-05`)가 기본값(default)으로 바인딩되도록 개선.

## 2. 계획 (plan)
1. **원인 분석**:
   - `TabContent.tsx`에서 `queryParams.character_names`에 콤마 구분 문자열을 담았으나, `ApiDataViewer`에 전달되는 `data` 객체에 파라미터 정보가 유실되어 단일 캐릭터만 인식되던 현상 발생.
2. **`TabContent.tsx` 수정**:
   - `selectedDate` 기본값 상태를 오늘 날짜(YYYY-MM-DD)로 설정.
   - `data` 객체를 `queryParams` 및 `character_names` 속성과 병합한 `enrichedData`로 래핑하여 `ApiDataViewer`에 전달.
3. **`ApiDataViewer.tsx` 수정**:
   - `SchedulerStateVisual` 파싱 로직에서 `rawData.queryParams.character_names` 속성 지원 추가.
4. **검증**: `pnpm build` 수행.

## 3. 실행 내역 (execution)
- **`src/components/TabContent.tsx`**:
  - `selectedDate` 초기 상태를 `getTodayString()`로 변경하여 `2026-10-05` 기본 바인딩.
  - `data`와 `queryParams`를 결합한 `enrichedData` 생성 및 `<ApiDataViewer data={enrichedData} />`로 전달.
- **`src/components/ApiDataViewer.tsx`**:
  - `SchedulerStateVisual`에서 `rawData.queryParams?.character_names` 파싱 로직 보완.

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음.

## 5. 검증 (validation)
- `pnpm build`: TypeScript 타입 체크 및 Vite 프로덕션 빌드 정상 통과 (`built in 648ms`).

## 6. 남은 할 일 (todo)
- 향후 다중 캐릭터 입력 시 즐겨찾는 부캐 목록 저장 기능 추가 고려.

## 7. 교훈 (lessons)
- 가상/커스텀 시뮬레이션 엔드포인트 및 복수 쿼리 데이터 처리 시, 쿼리 파라미터(`queryParams`) 객체를 응답 데이터(`data`)와 병합 전달하면 UI 뷰어가 손쉽게 멀티 파라미터를 인지할 수 있음.
