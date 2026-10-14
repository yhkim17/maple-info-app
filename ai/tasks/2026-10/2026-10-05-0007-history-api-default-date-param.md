# 큐브/스타포스/잠재능력 이력 API 기준일(date) 파라미터 디폴트 오늘 날짜 보완

- **일자**: 2026-10-05
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 잠재능력 재설정 이력(`history/potential`), 큐브 사용 이력(`history/cube`), 스타포스 강화 이력(`history/starforce`) 호출 시 `date` 파라미터 미지정으로 인해 return 데이터를 받아오지 못하거나 400 Bad Request가 발생하는 문제 해결
- 사용자가 직접 날짜를 입력하지 않더라도 디폴트로 **오늘 날짜(YYYY-MM-DD)**를 자동으로 전달하여 이력 데이터를 즉시 성공적으로 리턴받도록 개선

## 2. 계획 (plan)
1. **API 메뉴 메타데이터 파라미터 정의 보완 (`src/constants/apiMenus.ts`)**:
   - `history/potential`, `history/cube`, `history/starforce` API의 `date` 파라미터를 `required: true`로 지정하고 가이드 문구 보강
2. **동적 파라미터 생성 로직 수정 (`src/components/TabContent.tsx`)**:
   - `date` 파라미터 빌드 시 `selectedDate`가 전달되지 않았을 경우 로컬 KST 타임존 기준 오늘 날짜(`YYYY-MM-DD`)를 기본 디폴트 값으로 자동 삽입
   - UI 입력창에 "오늘 자동 적용" 안내 뱃지 추가 및 초기화 UX 개선
3. **검증**:
   - `pnpm lint` 및 `pnpm build`로 타입 및 빌드 통과 확인

## 3. 실행 내역 (execution)
- **수정된 파일**:
  - `src/constants/apiMenus.ts`: 이력 3종 API의 `date` 파라미터를 필수 파라미터로 지정
  - `src/components/TabContent.tsx`: `date` 파라미터 기본 디폴트 생성 함수 추가 및 "오늘 자동 적용" 뱃지 노출
- **기록 파일**:
  - `ai/tasks/2026-10/2026-10-05-0007-history-api-default-date-param.md`: 본 작업 내역 문서화 생성

## 4. 에러/트러블슈팅 (errors)
- **에러**: `TabContent.tsx` 수정 시 중괄호 `}` 중복으로 인해 `oxlint`에서 `Expected ',' or ')' but found else` 구문 오류 발생
- **해결**: 중복으로 들어간 닫는 중괄호 하나를 제거하여 린트 오류 해결

## 5. 검증 (validation)
1. **린트 검사**: `pnpm lint` (Oxlint) 실행 -> 17개 파일 대상 0 warning, 0 error 통과
2. **타입 및 빌드 검증**: `pnpm build` (`tsc -b && vite build`) 실행 -> 678ms 번들링 성공

## 6. 남은 할 일 (todo)
- [ ] 넥슨 오픈 API의 이력 데이터 조회 시 60일 이전 데이터 검색을 위한 과거 날짜 달력 프리셋 버튼 제공

## 7. 교훈 (lessons)
- 넥슨 오픈 API의 이력 조회 API(`history/*`)는 기준일(`date`) 파라미터가 없거나 형식이 일치하지 않으면 데이터를 빈 응답으로 전달하거나 에러를 반환하는 특성이 있으므로, 프론트엔드 단에서 디폴트로 오늘 날짜(`YYYY-MM-DD`)를 자동 제공하는 것이 에러 방지 및 UX 향상에 매우 효과적임.
