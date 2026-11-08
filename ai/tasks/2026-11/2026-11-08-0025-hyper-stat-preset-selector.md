# 하이퍼스탯 프리셋 선택 버튼 UI 및 프리셋별 조회 기능 구현

- **일자**: 2026-11-08
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 하이퍼스탯 정보(`/character/hyper-stat`) 조회 시 기존에는 현재 인게임에서 선택된 프리셋만 조회 가능했음.
- "프리셋 1", "프리셋 2", "프리셋 3" 버튼을 각각 추가하여 클릭 시 해당 프리셋의 하이퍼스탯 투자 정보를 조회할 수 있도록 변경.
- 기본 선택값은 현재 인게임에 설정된 프리셋(`use_preset_no`)으로 표시.
- 선택된 프리셋 버튼은 시각적으로 구분되는 색상(강조 스타일)으로 설정.

## 2. 계획 (plan)
1. **타입 정의 보강 (`src/types/mapleApi.ts`)**:
   - `CharacterHyperStatInfo`에 넥슨 Open API 규격 필드인 `use_available_hyper_stat`, `hyper_stat_preset_1_remain_point`, `hyper_stat_preset_2_remain_point`, `hyper_stat_preset_3_remain_point` 정의 추가.
2. **하이퍼스탯 뷰 컴포넌트 개선 (`src/components/ApiDataViewer.tsx`)**:
   - `HyperStatVisual`에 `selectedPreset` state를 도입하고, 기본값으로 `info.use_preset_no || '1'` 지정.
   - 캐릭터나 조회 기준일이 바뀔 때 기본 프리셋으로 초기화되도록 상위 호출부에서 고유 `key`(`date-character_class-use_preset_no`) 전달.
   - 프리셋 1, 2, 3 선택 버튼 탭 그룹 구현:
     - 선택된 버튼: 호박색 강조 스타일(`bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20`) 적용.
     - 미선택 버튼: 차분한 다크 슬레이트 스타일(`bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800`) 적용.
     - 실제 인게임 적용 중인 프리셋(`info.use_preset_no`)에는 '현재 적용' 뱃지 표시.
   - 상단 헤더에 현재 선택된 프리셋의 잔여 포인트(`currentRemainPoint`) 및 인게임 적용 프리셋 정보 표시.
   - 선택된 프리셋에 스탯 투자가 없는 경우 빈 상태(Empty state) 안내 문구 렌더링.
3. **검증 및 빌드 확인**:
   - `pnpm lint`(Oxlint) 및 `pnpm build`를 통한 문법, 타입, 빌드 무결성 검증.

## 3. 실행 내역 (execution)
- **`src/types/mapleApi.ts`**:
  - `CharacterHyperStatInfo` 인터페이스에 잔여 포인트 및 사용 가능 포인트 옵셔널 필드 추가.
- **`src/components/ApiDataViewer.tsx`**:
  - 상위 렌더러에서 `<HyperStatVisual>`에 `key` 속성을 부여하여 캐릭터 및 프리셋 기준 변경 시 안정적으로 리셋되도록 개선.
  - `HyperStatVisual` 컴포넌트 전면 개편:
    - `selectedPreset` 상태 추가 및 프리셋 1, 2, 3 버튼 렌더링.
    - 선택된 버튼과 미선택 버튼 간 테일윈드 스타일 분기.
    - 현재 인게임 활성 프리셋 배지 표시.
    - 투자된 스탯 목록 및 스탯 미투자 시 안내 화면 처리.

## 4. 에러/트러블슈팅 (errors)
- **에러**: React 훅 조기 리턴 및 조건부 호출 규칙 위반 (`rules-of-hooks`), `useEffect` 내 동기 `setState` 경고 (`set-state-in-effect`).
  - **원인**: `if (!info || !info.hyper_stat_preset_1)` 가드 조건문 아래에 `useState`가 위치했고, props 변경 감지를 위해 `useEffect` 내에서 `setSelectedPreset`을 호출하면서 발생.
  - **해결**: 모든 훅 선언을 컴포넌트 최상단에 배치하고, props 변경 시 상태 초기화는 React 권장 패턴에 따라 상위 컴포넌트에서 고유 `key` 속성을 전달하는 방식으로 리팩토링하여 `useEffect` 없이 깔끔하게 상태를 동기화함.

## 5. 검증 (validation)
- **린트 검사 (`pnpm lint`)**: Oxlint 실행 결과 `ApiDataViewer.tsx` 관련 에러/경고 0건으로 통과.
- **빌드 및 타입 검사 (`pnpm build`)**: TypeScript 타입 컴파일 및 Vite 번들링 정상 완료 (`dist/` 생성 성공).

## 6. 남은 할 일 (todo)
- [ ] 필요 시 성향, 어빌리티 등 다른 프리셋 지원 항목에도 일관된 프리셋 전환 UI 확장 고려.

## 7. 교훈 (lessons)
- React에서 부모로부터 전달받는 props가 변경될 때 자식 컴포넌트의 내부 state를 초기화해야 하는 경우, `useEffect`로 `setState`를 호출하기보다 상위에서 변경 기준 값을 조합한 `key` prop을 넘겨 리마운트시키는 방식이 렌더링 폭포수(cascading renders)를 방지하고 React Compiler 최적화에 가장 적합하다.
