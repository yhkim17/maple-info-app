# [React/TS 프로젝트 구조 및 문법 학습 가이드 문서화]

- **일자**: 2026-10-11
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 사용자가 요청한 프로젝트 구조, 데이터 흐름, 핵심 React & TypeScript 문법 해설 내용을 영구적으로 보관하고 언제든 열람할 수 있도록 `ai/` 디렉토리 하위에 적절한 문서 파일로 작성하여 저장.

## 2. 계획 (plan)
- `ai/docs/` 디렉토리 신설 및 체계적인 마크다운 문서 생성 (`react-ts-project-architecture-and-syntax-guide.md`)
- 프로젝트 아키텍처, 데이터 라이프사이클 다이어그램, 5대 핵심 문법(제네릭, 상태 끌어올리기, 조건부 렌더링, 옵셔널 체이닝/널 병합, TanStack Query 커스텀 훅), 권장 학습 로드맵 포함
- GEMINI.md 규칙에 따라 `ai/tasks/2026-10/`에 작업 내역 문서 기록

## 3. 실행 내역 (execution)
- 신규 문서 작성: `ai/docs/react-ts-project-architecture-and-syntax-guide.md`
- 작업 기록 문서 작성: `ai/tasks/2026-10/2026-10-11-0021-save-learning-guide-docs.md`

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음

## 5. 검증 (validation)
- 파일 생성 및 경로 확인 완료 (`ai/docs/react-ts-project-architecture-and-syntax-guide.md`)
- 마크다운 문법 및 상대 링크 유효성 점검 완료

## 6. 남은 할 일 (todo)
- [ ] 향후 신규 기능이나 복잡한 상태 관리 로직(예: 전역 상태, 커스텀 모달 등) 도입 시 해당 가이드 문서에 추가 업데이트

## 7. 교훈 (lessons)
- 개발 중 작성된 아키텍처 및 문법 해설을 `ai/docs/`와 같은 전용 문서 디렉토리에 아카이빙해 두면, 초보 개발자가 프로젝트를 점진적으로 이해하고 후속 기능을 직접 개발할 때 훌륭한 레퍼런스가 됨.
