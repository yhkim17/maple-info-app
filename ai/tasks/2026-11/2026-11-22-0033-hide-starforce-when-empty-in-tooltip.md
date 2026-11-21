# 장착 장비(/item-equipment) 툴팁 내 스타포스 없는 아이템 별 표시 제거

- **일자**: 2026-11-22
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 장착 장비 정보(`/item-equipment`)에서 아이템 아이콘을 선택하여 열리는 상세 툴팁 모달(`ItemTooltipModal`)에서 스타포스가 없는 아이템(스타포스 수치 0성, 엠블렘, 포켓 아이템, 뱃지 등 스타포스 불가/미강화 장비)은 상단 별 표시(스타포스 30성 그리드) 없이 깔끔하게 표시되도록 변경.

## 2. 계획 (plan)
1. **스타포스 유무 판정 조건 분석 (`src/components/ApiDataViewer.tsx`)**:
   - 기존의 `hasStarforce` 조건식 검토:
     `starforceCount > 0 || item.starforce_scroll_flag === '사용' || Boolean(item.item_starforce_option && Object.keys(item.item_starforce_option).length > 0)`
   - 문제 원인: 넥슨 Open API는 스타포스가 없는 장비라도 `item_starforce_option`에 `{ str: "0", dex: "0", ... }` 형태의 키 목록을 항상 반환하므로 `Object.keys(...).length > 0` 검사가 무조건 `true`로 평가되어 모든 아이템에서 빈 별 30개가 표시되었음.
   - 해결책: 스타포스 유무를 실제 스타포스 강화 수치인 `starforceCount > 0` (`parseInt(item.starforce || '0', 10) > 0`)로 정확하게 판정하도록 단순화 및 개선.
2. **놀라운 장비강화 주문서(놀장강) 호환성 보완**:
   - `item.starforce_scroll_flag === '사용'`인 경우 인게임 규칙에 맞춰 별 색상을 파란색(`fill-sky-400 text-sky-400`)으로 표시하도록 추가 보완.
3. **코드 검증**:
   - TypeScript 타입 검사(`pnpm exec tsc --noEmit`), 린트 검사(`pnpm lint`), 프로덕션 빌드(`pnpm build`) 수행.

## 3. 실행 내역 (execution)
- **수정된 파일**:
  - `src/components/ApiDataViewer.tsx`:
    - `ItemTooltipModal` 컴포넌트의 `hasStarforce` 조건을 `starforceCount > 0`으로 변경하여, 스타포스가 0성이거나 스타포스 강화가 적용되지 않은 아이템(엠블렘, 뱃지, 성배, 훈장 등) 선택 시 상단 스타포스 30개 별 슬롯이 노출되지 않도록 처리.
    - 놀장강 아이템(`starforce_scroll_flag === '사용'`)인 경우 별 색상을 메이플 인게임과 동일하게 스카이블루(`sky-400`)로 표현할 수 있도록 SVG 스타일 분기 로직 적용.

## 4. 에러/트러블슈팅 (errors)
- **EPERM 권한 오류 (`pnpm build`)**:
  - 샌드박스 환경 내에서 `node_modules` 임시 빌드 캐시(`.tmp`, `.vite-temp`) 생성 시 권한 오류(`EPERM`) 발생.
  - **해결**: 프로젝트 가이드라인에 따라 `tsc --noEmit`을 통한 정적 타입 검증 후 호스트 권한으로 빌드를 수행하여 정상적으로 빌드 완료 확인.

## 5. 검증 (validation)
1. **타입 검사**: `pnpm exec tsc --noEmit` -> 에러 0건 정상 통과
2. **린트 검사**: `pnpm lint` (Oxlint) -> 에러 0건 (기존 TabContent Date() 경고 1건 외 이슈 없음)
3. **빌드 검증**: `pnpm build` (`tsc -b && vite build`) -> 정상 통과 (빌드 소요 832ms, 번들 생성 완료)

## 6. 남은 할 일 (todo)
- [ ] 사용자 실서버 구동 후 브라우저 상에서 포켓 아이템(핑크빛 성배 등), 엠블렘, 일반 장비(스타포스 적용/미적용) 클릭 시 툴팁 표시 상태 최종 확인

## 7. 교훈 (lessons)
- 넥슨 메이플스토리 Open API의 응답 객체(예: `item_starforce_option`, `item_add_option`)는 수치가 0이더라도 모든 스탯 키가 기본값(`"0"`)으로 채워져 반환되는 경우가 많습니다.
- 따라서 객체의 키 존재 여부(`Object.keys().length > 0`)로 옵션 적용 여부를 판별하면 안 되며, `starforce` 문자열 수치 파싱(`parseInt(item.starforce, 10) > 0`) 또는 내부 스탯 값의 실제 유효성(`value > 0`)을 기준으로 검사해야 안전합니다.
