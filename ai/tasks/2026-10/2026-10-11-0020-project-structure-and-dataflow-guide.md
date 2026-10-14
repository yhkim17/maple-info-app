# [프로젝트 구조 및 데이터 흐름 가이드 정리]

- **일자**: 2026-10-11
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- React, TypeScript 학습 목적으로 제작된 메이플 API 프로젝트의 전체적인 아키텍처, 디렉터리 구조, 컴포넌트 간 데이터 흐름, 핵심 문법 요소들을 초보자 및 학습자 관점에서 알기 쉽게 정리 및 설명.
- 코드에 사용된 주요 React 19 / TypeScript / TanStack Query 문법과 패턴에 대한 직관적인 해설 제공.

## 2. 계획 (plan)
- 프로젝트 내 디렉터리 구성(`src/api`, `src/components`, `src/hooks`, `src/types`, `src/constants`) 분석
- 사용자의 검색부터 API 응답 및 화면 렌더링까지 이어지는 라이프사이클/데이터 흐름 다이어그램 및 설명 작성
- 자주 등장하는 React / TypeScript 핵심 문법(제네릭, 커스텀 훅, 조건부 렌더링, 불변성, 타입 정의 등)을 코드 예시와 함께 정리
- 사용자 맞춤형 가이드 답변 제공 및 작업 기록 작성

## 3. 실행 내역 (execution)
- 작업 로그 문서 생성: `ai/tasks/2026-10/2026-10-11-0020-project-structure-and-dataflow-guide.md`
- 전체 프로젝트 아키텍처 및 흐름 분석 완료:
  - `main.tsx` -> React Query Provider 설정 및 Root 마운트
  - `App.tsx` -> 메인 상태 머신 (캐릭터 검색 여부에 따른 화면 분기, 메뉴 상태 관리)
  - `CharacterSearch.tsx` -> 닉네임 입력 및 OCID 검증 로직
  - `Navbar.tsx` / `LeftSidebar.tsx` -> 2단 계층 네비게이션 시스템
  - `TabContent.tsx` -> 파라미터 조합 및 `useNexonApiQuery` 트리거
  - `useNexonApiQuery.ts` + `api/index.ts` -> Axios + TanStack Query 기반 비동기 캐싱 계층
  - `ApiDataViewer.tsx` -> 응답 데이터 시각화 및 커스텀 뷰어

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음 (프로젝트 분석 및 학습 가이드 문서화 작업)

## 5. 검증 (validation)
- `pnpm lint` 및 `pnpm build`를 통한 기존 코드 안정성 상태 점검.

## 6. 남은 할 일 (todo)
- [ ] 학습자가 개별 컴포넌트나 특정 문법에 대해 추가 질문 시 코드 레벨에서 단계별 상세 설명 진행
- [ ] 필요 시 복잡한 `ApiDataViewer.tsx` 내의 도메인별 렌더러 분리 리팩토링 검토

## 7. 교훈 (lessons)
- React와 TypeScript 입문 시 컴포넌트 계층 간 Props 전달 흐름(상태 끌어올리기, Props Drilling vs 전역/서버 상태 관리)과 비동기 데이터 패칭(React Query)의 역할을 명확히 구분하여 이해하는 것이 학습 곡선을 크게 낮출 수 있음.
