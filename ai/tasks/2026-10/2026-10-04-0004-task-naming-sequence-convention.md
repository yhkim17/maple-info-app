# 작업 기록 파일명 순번(SEQ) 규칙 추가 및 기존 파일 리네이밍

- **일자**: 2026-10-04
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- `ai/tasks/YYYY-MM/` 내 작업 기록 마크다운 파일 생성 시, 시간 순서대로 정렬 및 열람이 용이하도록 4자리 순번(`0001`, `0002`, ...)을 포함하도록 명시
- [GEMINI.md](../../GEMINI.md)에 새로운 파일명 네이밍 규칙 업데이트
- 기존에 생성되었던 파일들을 생성 순서(타임스탬프)에 맞추어 `0001`, `0002`, `0003` 형식으로 파일명 일괄 변경

## 2. 계획 (plan)
1. `GEMINI.md`의 `1-1. 저장 경로 및 파일명 규칙` 섹션 수정 (`YYYY-MM-DD-SEQ-<작업명>.md`)
2. 기존에 생성된 3개 작업 문서의 생성 시간 확인:
   - 1차: `main-character-search-ui.md` -> `0001`
   - 2차: `navigation-topbar-menus.md` -> `0002`
   - 3차: `character-ocid-validation.md` -> `0003`
3. PowerShell `Rename-Item` 명령어를 통해 파일명 변경
4. 변경 결과 확인 및 현재 작업 내용을 `0004`번 파일로 기록

## 3. 실행 내역 (execution)
- **수정된 파일**:
  - `GEMINI.md`: 파일명 규칙에 4자리 순번(`SEQ`) 명시 추가
- **이름 변경된 파일**:
  - `ai/tasks/2026-10/2026-10-04-main-character-search-ui.md` ➡️ `2026-10-04-0001-main-character-search-ui.md`
  - `ai/tasks/2026-10/2026-10-04-navigation-topbar-menus.md` ➡️ `2026-10-04-0002-navigation-topbar-menus.md`
  - `ai/tasks/2026-10/2026-10-04-character-ocid-validation.md` ➡️ `2026-10-04-0003-character-ocid-validation.md`
- **신규 기록 파일**:
  - `ai/tasks/2026-10/2026-10-04-0004-task-naming-sequence-convention.md`: 본 작업 내역 문서화

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음

## 5. 검증 (validation)
1. `Get-ChildItem "ai/tasks/2026-10"` 실행 결과 모든 기존 파일이 4자리 순번으로 정확하게 정렬되어 출력됨을 확인
2. `GEMINI.md` 파일 규칙 문구 수정 확인

## 6. 남은 할 일 (todo)
- [ ] 향후 모든 작업 기록 작성 시 최신 순번(`0005`부터)을 이어서 부여하기
- [ ] 다음 개발 기능(OCID 기반 캐릭터 기본 정보 조회 및 뷰 연동) 진행

## 7. 교훈 (lessons)
- 파일명에 일자(`YYYY-MM-DD`) 뒤 4자리 고정 길이 순번(`SEQ: 0001, 0002...`)을 적용하면 파일 탐색기나 IDE 트리 목록에서 생성 시간 순으로 일관되게 정렬되어 작업 이력 추적이 매우 편리해짐.
