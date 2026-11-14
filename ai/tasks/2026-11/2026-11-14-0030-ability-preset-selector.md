# [작업] 어빌리티 정보(/character/ability) 프리셋 선택 UI 및 프리셋별 조회 기능 구현

- **일자**: 2026-11-14
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- `/character/ability`(어빌리티 정보) 조회 시 `/character/hyper-stat`(하이퍼스탯 정보)와 동일하게 프리셋(프리셋 1, 프리셋 2, 프리셋 3) 선택 및 조회 기능 적용.
- 기본 선택값은 현재 인게임에 설정되어 적용 중인 프리셋(`preset_no`)으로 설정.
- 하이퍼스탯과 동일한 UI/UX(선택 버튼 강조 스타일, 현재 적용 배지, 인게임 적용 안내 뱃지, 등급 요약 카드 및 옵션 목록 등) 적용.

## 2. 계획 (plan)
1. **타입 정의 확장 (`src/types/mapleApi.ts`)**:
   - `AbilityPreset` 인터페이스 정의 (`ability_preset_grade`, `ability_grade`, `ability_info: AbilityOption[]`).
   - `CharacterAbilityInfo` 인터페이스에 넥슨 Open API 규격 필드인 `preset_no`, `ability_preset_1`, `ability_preset_2`, `ability_preset_3` 추가.
2. **어빌리티 뷰 컴포넌트 개선 (`src/components/ApiDataViewer.tsx`)**:
   - 상위 렌더러 `VisualApiRenderer`에서 캐릭터/일자/프리셋 변경 시 상태가 올바르게 재초기화되도록 고유 `key`(`abilityInfo?.date-abilityInfo?.preset_no`) 전달.
   - `AbilityVisual` 컴포넌트 전면 개편:
     - `selectedPreset` state 도입 및 기본값으로 `info.preset_no` (없을 시 '1') 지정.
     - `presetList = ['1', '2', '3']` 버튼 그룹 렌더링:
       - 선택된 버튼: 호박색 강조 스타일(`bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20`) 적용.
       - 미선택 버튼: 차분한 다크 슬레이트 스타일(`bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200`) 적용.
       - 현재 인게임에 적용 중인 프리셋에는 '현재 적용' 뱃지 표시.
     - 상단 요약 영역: 인게임 적용 프리셋 번호 및 보유 명성치(`remain_fame`) 표시.
     - 선택된 프리셋의 어빌리티 등급 카드(레전드리/유니크/에픽/레어 색상 배지) 및 적용 옵션 수 표시.
     - 선택된 프리셋의 어빌리티 줄(총 3줄) 목록 렌더링 및 미설정 시 Empty State 안내 UI 제공.
3. **검증 및 빌드 확인**:
   - `pnpm lint`(Oxlint) 및 `pnpm build`(TypeScript 컴파일 & Vite 번들링) 통과 검증.
   - Playwright 브라우저 테스트를 통해 실제 캐릭터(ColdZone)의 어빌리티 프리셋 1, 2, 3 전환 및 실데이터 렌더링 검증.

## 3. 실행 내역 (execution)
- **`src/types/mapleApi.ts`**:
  - `AbilityPreset` 인터페이스 신설:
    ```typescript
    export interface AbilityPreset {
      ability_preset_grade?: string;
      ability_grade?: string;
      ability_info: AbilityOption[];
    }
    ```
  - `CharacterAbilityInfo` 인터페이스 확장:
    ```typescript
    export interface CharacterAbilityInfo {
      date: string;
      ability_grade: string;
      ability_info: AbilityOption[];
      remain_fame: number;
      preset_no?: number | string | null;
      ability_preset_1?: AbilityPreset | null;
      ability_preset_2?: AbilityPreset | null;
      ability_preset_3?: AbilityPreset | null;
    }
    ```
- **`src/components/ApiDataViewer.tsx`**:
  - `AbilityPreset` import 추가.
  - `VisualApiRenderer`에서 `<AbilityVisual key={`${abilityInfo?.date}-${abilityInfo?.preset_no ?? ''}`} info={abilityInfo} />` 형태로 호출하여 인스턴스 격리 및 상태 동기화 처리.
  - `AbilityVisual` 컴포넌트 재설계:
    - `useMemo` 기반으로 `selectedPreset`에 따른 등급 및 어빌리티 옵션 목록 추출 (프리셋 미지원 구형 데이터에 대한 fallback 로직 포함).
    - 프리셋 1, 2, 3 선택 탭 그룹 추가 (선택 시 하이라이트 및 '현재 적용' 태그 렌더링).
    - 어빌리티 등급 카드, 보유 명성치(pt) 카드, 옵션 라인별 등급/수치 카드 UI 구성.
    - 미설정된 프리셋에 대한 Empty State(안내 문구) 처리.

## 4. 에러/트러블슈팅 (errors)
- **Playwright MCP click 도구 파라미터 이슈**:
  - **원인**: `browser_click` 호출 시 스키마가 `selector`가 아닌 `target`(스냅샷 ref ID 또는 선택자 문자열)을 필수로 요구하여 인자 검증 오류 발생.
  - **해결**: `C:\Users\kimyu\.gemini\antigravity-cli\mcp\playwright\browser_click.json` 스키마를 확인한 후 `target` 인수를 통해 올바른 ref(`e268`, `e271`, `e273` 등)를 지정하여 클릭 액션 정상 수행.

## 5. 검증 (validation)
- **정적 분석 및 린트 (`pnpm lint`)**:
  - Oxlint 실행 결과 에러 0건으로 통과 (`TabContent.tsx`의 기존 Date 불순 함수 경고 1건 외 신규 경고 없음).
- **타입 검사 및 프로덕션 빌드 (`pnpm build`)**:
  - `tsc -b && vite build` 정상 완료 (0.98초 만에 번들 생성 완료).
- **Playwright 브라우저 E2E 수동 검증**:
  - 캐릭터 `ColdZone`으로 `/character/ability` 화면 접근.
  - 기본 상태에서 인게임 활성 프리셋인 "프리셋 1"이 선택되어 있고 '현재 적용', '인게임 활성' 뱃지가 올바르게 노출됨을 확인.
  - "프리셋 2" 클릭 시: 레전드리 버프 지속 시간 50% 증가, 유니크 메소 획득량 15% 증가, 아이템 드롭률 15% 증가로 즉시 갱신됨을 확인.
  - "프리셋 3" 클릭 시: 레전드리 아이템 드롭률 20% 증가, 유니크 버프 지속 시간 34% 증가, 메소 획득량 15% 증가로 즉시 갱신됨을 확인.
  - 캡처 스크린샷(`ai/playwright/img/page-2026-11-14T13-53-39-482Z.png`) 및 콘솔/스냅샷 파일 저장 완료.

## 6. 남은 할 일 (todo)
- [ ] 성향 정보 등 다른 프리셋 또는 세부 옵션을 제공하는 엔드포인트 발생 시 동일한 탭/프리셋 디자인 시스템 확장 적용.

## 7. 교훈 (lessons)
- 하이퍼스탯과 어빌리티처럼 유사한 도메인(프리셋 1/2/3, 활성 프리셋, 잔여 포인트/명성치)을 다루는 UI 컴포넌트는 동일한 레이아웃 구조, 테마 색상(호박색 `amber-500` 하이라이트 및 다크 슬레이트 백그라운드), 뱃지 네이밍(`현재 적용`, `인게임 활성`) 규칙을 일관되게 공유함으로써 사용자 경험을 크게 개선할 수 있다.
- 자식 컴포넌트의 초기 상태를 props 기준과 동기화할 때 상위에서 `key` prop을 전략적으로 활용하면 `useEffect` 기반 상태 덮어쓰기 없이도 React의 렌더링 성능과 순수성을 완벽히 보장할 수 있다.
