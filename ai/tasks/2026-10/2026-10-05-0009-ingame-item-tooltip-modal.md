# 메이플스토리 인게임 양식 장착 장비 상세 툴팁 모달 구현

- **일자**: 2026-10-05
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 사용자가 첨부한 메이플스토리 인게임 아이템 툴팁 이미지와 동일한 양식으로, 장착 장비 목록(`character/item-equipment`)에서 아이템 클릭 시 인게임 스타포스, 아이템 등급, 이미지, 스탯 옵션, 가위 사용 가능 횟수, 잠재옵션(L/U/E/R 뱃지), 에디셔널 잠재옵션, 소울 옵션이 팝업 모달 형태로 상세히 표시되도록 구현

## 2. 계획 (plan)
1. **아이템 스펙 타입 확장 (`src/types/mapleApi.ts`)**:
   - `ItemEquipment` 인터페이스에 추가옵션(`item_add_option`), 주문서옵션(`item_etc_option`), 스타포스옵션(`item_starforce_option`), 가위 사용 가능 횟수(`cuttable_count`), 소울 정보(`soul_name`, `soul_option`) 필드 확장
2. **인게임 장비 툴팁 모달 UI 개발 (`src/components/ApiDataViewer.tsx`)**:
   - `ItemTooltipModal` 컴포넌트 개발:
     - 상단: 스타포스(★ N성), 아이템 이름, 아이템 등급 명칭(`(레전드리 아이템)`)
     - 구분선: 점선 스타일 (`border-dashed`)
     - 중앙: 등급 보더 라인 기반 아이템 아이콘
     - 옵션 구역: 장비분류, 스탯 옵션 목록(`INT: +40`, `LUK: +40` 등), 가위 사용 가능 횟수(Amber 컬러)
     - 잠재옵션 / 에디셔널 잠재옵션 구역: 등급별 네모 뱃지(`[L]`, `[U]`, `[E]`, `[R]`) 및 옵션 3줄 노출
     - 소울 옵션 구역: 소울 이름 및 효과
3. **클릭 및 상호작용 지원 (`ItemEquipmentVisual`)**:
   - 카드 클릭 시 해당 아이템을 선택하여 인게임 툴팁 모달이 호버/팝업되도록 이벤트 구성
4. **검증**:
   - `pnpm lint` 및 `pnpm build` 실행

## 3. 실행 내역 (execution)
- **수정된 파일**:
  - `src/types/mapleApi.ts`: `ItemEquipment` 인터페이스에 `cuttable_count`, `soul_name` 등 추가 필드 확장
  - `src/components/ApiDataViewer.tsx`:
    - `ItemEquipmentVisual` 컴포넌트에 `selectedItem` 상태 추가 및 클릭 시 모달 열기 구현
    - `ItemTooltipModal` 컴포넌트 제작 (메이플 인게임 장비 툴팁 디자인 양식 충실 재현)
- **기록 파일**:
  - `ai/tasks/2026-10/2026-10-05-0009-ingame-item-tooltip-modal.md`: 본 작업 내역 문서화 생성

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음 (타입 무결성 및 린트/빌드 한 번에 정상 통과)

## 5. 검증 (validation)
1. **린트 검사**: `pnpm lint` (Oxlint) -> 17개 파일 0 warning, 0 error 통과
2. **타입 및 빌드 검증**: `pnpm build` (`tsc -b && vite build`) -> 683ms 만에 성공

## 6. 남은 할 일 (todo)
- [ ] 캐시 장비(`character/cashitem-equipment`) 및 코디 룩에 대해서도 동일한 툴팁 모달 스타일 확장 적용

## 7. 교훈 (lessons)
- 인게임 메이플스토리 UI 디자인(다크 카드, 점선 구분선, L/U/E/R 등급 네모 뱃지, 황금색 가위 횟수 등)을 세심하게 재현하여 툴팁 모달을 구성함으로써 유저 친화적이고 몰입감 높은 메이플 정보 서비스 UX를 제공할 수 있게 됨.
