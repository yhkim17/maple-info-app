# 메인 화면 캐릭터명 입력 UI 및 실행 환경 구성

- **일자**: 2026-10-04
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
1. 메이플 API 활용 리액트 타입스크립트 학습 프로젝트의 실행 방법 확인 및 안내
2. `agy` 실행 시 참조하는 마크다운(`.md`) 파일 조사 및 규칙 설명
3. 생성된 프로젝트의 전체 폴더 및 파일 구조 분석
4. 메인 화면에 캐릭터명 입력용 input 박스와 확인 버튼 UI 구성
5. AI 작업 내역을 7개 필수 항목으로 기록하는 룰을 담은 `GEMINI.md` 생성 및 `ai/tasks/2026-10/` 내 아카이빙 설정

## 2. 계획 (plan)
1. `package.json`, `pnpm-lock.yaml`, `.env` 등을 검토하여 실행 명령어 및 의존성 파악
2. Vite 기본 템플릿 코드(`App.tsx`, `App.css`)를 분석하고 불필요한 보일러플레이트 제거
3. React 19 및 Tailwind CSS v4를 활용하여 다크 테마 기반의 캐릭터명 입력 폼 컴포넌트 작성
4. Oxlint 및 TypeScript 컴파일(`tsc -b && vite build`)을 실행하여 문법 및 빌드 무결성 검증
5. 요구사항에 부합하는 `GEMINI.md`를 프로젝트 루트에 작성하고 첫 번째 작업 로그 생성

## 3. 실행 내역 (execution)
- **수정된 파일**:
  - `src/App.tsx`: 캐릭터명 상태(`characterName`, `submittedName`) 및 입력 폼/확인 버튼 구현
  - `index.html`: 페이지 타이틀을 `메이플 캐릭터 정보 검색`으로 변경
- **삭제된 파일**:
  - `src/App.css`: Tailwind CSS v4 직접 사용으로 불필요해진 기본 템플릿 CSS 삭제
- **생성된 파일**:
  - `GEMINI.md`: 7대 필수 항목 작업 로그 작성 규칙 및 프로젝트 개발 가이드 정의
  - `ai/tasks/2026-10/2026-10-04-main-character-search-ui.md`: 첫 번째 작업 기록 문서
- **주요 실행 커맨드**:
  - `pnpm dev`: 로컬 개발 서버 구동 명령어 확인
  - `pnpm lint`: Oxlint 검사 (0 warning, 0 error)
  - `pnpm build`: TypeScript 빌드 검증

## 4. 에러/트러블슈팅 (errors)
- **에러**: `Select-String` 명령어 사용 시 하위 디렉토리(`src/api`, `src/assets`) 접근 권한 오류 발생
- **해결**: PowerShell의 파일 탐색 플래그를 정정하고, 사용하지 않는 `src/App.css` 파일은 명시적으로 `Remove-Item`을 통해 안전하게 제거함.

## 5. 검증 (validation)
1. **린트 검증**: `pnpm lint` (Oxlint) 실행 결과 오류 0건 통과
2. **빌드 검증**: `pnpm build` (`tsc -b && vite build`) 실행 결과 정상 번들링 완료
3. **규칙 파일 검증**: `GEMINI.md` 생성 완료 및 경로 규칙 확인

## 6. 남은 할 일 (todo)
- [ ] `@tanstack/react-query`의 `QueryClientProvider`를 `src/main.tsx`에 연동
- [ ] 입력받은 캐릭터명으로 넥슨 Open API 캐릭터 식별자(`ocid`) 조회 API 호출 연동
- [ ] 조회 중 로딩(Spinner), 에러(존재하지 않는 캐릭터 등) UI 처리
- [ ] 캐릭터 기본 정보(레벨, 직업, 월드, 캐릭터 외형 이미지) 카드 컴포넌트 구현

## 7. 교훈 (lessons)
- Tailwind CSS v4에서는 `@import "tailwindcss";` 방식을 사용하므로 기본 Vite 템플릿의 `App.css`를 제거하고 순수 유틸리티 클래스로 통일하는 것이 스타일 충돌 방지에 효과적임.
- React 19 환경에서도 제어 컴포넌트 패턴(`value`, `onChange`) 및 `<form onSubmit>` 핸들링은 안정적으로 동작함.
