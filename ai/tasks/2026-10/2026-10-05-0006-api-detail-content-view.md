# 좌측 API 메뉴 클릭 시 우측 메인 뷰 데이터 연동 및 전용 시각화 UI 확장

- **일자**: 2026-10-05
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 사용자가 좌측 서브 API 메뉴 클릭 시 선택한 API 엔드포인트와 현재 입력된 파라미터(ocid, date, character_name, skill_grade 등)를 바탕으로 넥슨 Open API를 자동으로 데이터 호출하여 우측 본문 뷰어에 실시간 결과를 시각화(Visual View) 및 원본 JSON(Raw View)으로 노출하도록 개발 연동을 지속 완료함.

## 2. 계획 (plan)
1. **API 호출 파라미터 & React Query 훅 동기화 확인**:
   - `TabContent.tsx` 및 `useNexonApiQuery` 훅을 점검하여 좌측 메뉴 클릭 시 activeSubApi 변경에 맞추어 `queryKey`와 엔드포인트가 동적으로 반응하여 즉시 API 재호출이 이루어지도록 검증.
2. **응답 데이터 시각화 렌더러(Visual Renderer) 대폭 확장**:
   - `src/types/mapleApi.ts`: 성향(`CharacterPropensityInfo`), 어빌리티(`CharacterAbilityInfo`), 심볼(`CharacterSymbolInfo`), 하이퍼스탯(`CharacterHyperStatInfo`), 링크 스킬(`CharacterLinkSkillInfo`), 길드 기본 정보(`GuildBasicInfo`) 등의 인터페이스 타입 정의.
   - `src/components/ApiDataViewer.tsx`: 해당 엔드포인트 클릭 시 전용 UI(성향 프로그레스바, 어빌리티 등급 뱃지, 심볼 성장치 바, 하이퍼스탯 레벨, 링크 스킬 효과, 길드 스킬 카드 등)가 표시되도록 `VisualApiRenderer` 조건 확장 및 6대 신규 커스텀 시각화 뷰어 개발.
3. **빌드 및 린트 검증**:
   - `pnpm lint` 및 `pnpm build`로 타입 안전성 및 컴파일 무결성 검증.

## 3. 실행 내역 (execution)
- **수정된 파일**:
  - `src/types/mapleApi.ts`: 메이플스토리 오픈 API의 성향, 어빌리티, 심볼, 하이퍼스탯, 링크 스킬, 길드 관련 TypeScript 타입 인터페이스 추가.
  - `src/components/ApiDataViewer.tsx`:
    - `VisualApiRenderer`에 `character/propensity`, `character/ability`, `character/symbol-equipment`, `character/hyper-stat`, `character/link-skill`, `guild/basic` 엔드포인트 분기 연동.
    - `PropensityVisual`, `AbilityVisual`, `SymbolVisual`, `HyperStatVisual`, `LinkSkillVisual`, `GuildBasicVisual` 전용 렌더링 컴포넌트 6종 추가 개발.
- **기록 파일**:
  - `ai/tasks/2026-10/2026-10-05-0006-api-detail-content-view.md`: 본 작업 내역 문서화 생성.

## 4. 에러/트러블슈팅 (errors)
- **에러**: `pnpm build` (`tsc -b`) 실행 시 `ApiDataViewer.tsx`에서 `HyperStatPreset` 인터페이스 타입의 import 미비로 인한 `error TS2304: Cannot find name 'HyperStatPreset'` 발생.
- **해결**: `ApiDataViewer.tsx` 상단 import 구문에 `HyperStatPreset`을 명시적으로 추가하여 TypeScript 컴파일 에러를 완벽하게 해결함.

## 5. 검증 (validation)
1. **린트 검사**: `pnpm lint` (Oxlint) 실행 -> 17개 파일 대상 0 warning, 0 error 통과.
2. **타입 및 빌드 검증**: `pnpm build` (`tsc -b && vite build`) 실행 -> 671ms 만에 번들링 성공 및 타입 무결성 검증 완료.

## 6. 남은 할 일 (todo)
- [ ] 넥슨 오픈 API의 429 Rate Limit (초당 5회 제한) 완화를 위한 요청 디바운싱 또는 캐시 무효화 제어 로직 보완
- [ ] 나머지 카테고리(확률 정보, 스케줄러 정보, 랭킹 정보) 엔드포인트에 대한 추가 시각화 뷰어 지속 보강

## 7. 교훈 (lessons)
- API 엔드포인트별 다양한 데이터 구조를 범용 JSON 뷰어뿐만 아니라 전용 시각화 컴포넌트(Visual View)로 분기 처리함으로써, 사용자가 어떤 서브 메뉴를 클릭하더라도 직관적이고 풍부한 메이플스토리 정보 UI를 즉각 확인할 수 있는 UX를 제공함.
