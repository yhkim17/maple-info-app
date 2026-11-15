# [검증] Playwright MCP, Chromium 브라우저 및 Python 3.12 환경 연동 확인

- **일자**: 2026-11-15
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 새로 설치된 Playwright MCP, Chromium 브라우저 및 Python 3.12 환경이 정상적으로 연동되어 작동하는지 점검.
- 로컬 개발 서버(`http://localhost:5173`)에 접속하여 실제 페이지 렌더링, 콘솔 로그, 스냅샷 및 스크린샷 캡처가 정상 동작하는지 검증.
- 생성된 산출물(스크린샷, 스냅샷, 로그)을 `GEMINI.md`에 정의된 년월별 규칙(`ai/playwright/<유형>/2026-11/`)에 맞추어 관리.

## 2. 계획 (plan)
1. **Python 버전 확인**: `python --version` 및 `pip list`를 통해 Python 3.12 및 주요 라이브러리 설치 확인.
2. **로컬 서버 포트 상태 확인**: `Test-NetConnection`으로 `localhost:5173` 포트 개방 확인.
3. **Playwright MCP 연동 및 브라우저 탐색**:
   - `call_mcp_tool`을 통해 Playwright MCP의 `browser_navigate` 호출하여 `http://localhost:5173` 접속.
   - 타이틀 확인 및 접근성 스냅샷 수집.
4. **스크린샷 캡처 및 산출물 정리**:
   - `browser_take_screenshot`을 실행하여 `ai/playwright/img/2026-11/localhost-5173-home.png`로 저장.
   - MCP 자동 생성 파일(스냅샷, 콘솔 로그)을 `ai/playwright/text/2026-11/`로 이동 정리.
5. **프로젝트 빌드 및 린트 검증**: `pnpm lint`, `pnpm build` 수행.

## 3. 실행 내역 (execution)
- **Python 환경 점검**:
  - `python --version`: `Python 3.12.10` 확인.
  - `pip list`: `python-pptx 1.0.2`, `pillow 13.0.0`, `xlsxwriter 3.3.1` 등 설치 확인.
- **포트 및 네트워크 점검**:
  - `localhost:5173` 연결 테스트: `TcpTestSucceeded : True` (127.0.0.1:5173 정상 구동 중).
- **Playwright MCP 브라우저 조작**:
  - `browser_navigate`: `http://localhost:5173` 접속 완료 (Page Title: "메이플 캐릭터 정보 검색").
  - `browser_take_screenshot`: Full-page 스크린샷 생성 (`ai/playwright/img/2026-11/localhost-5173-home.png`).
  - `browser_close`: 테스트 완료 후 브라우저 세션 정상 종료.
- **산출물 디렉토리 정리**:
  - `manual_images` 내 자동 생성된 파일들을 `ai/playwright/text/2026-11/`로 이동:
    - `console-2026-11-15T11-51-29-657Z.log`
    - `page-2026-11-15T11-51-30-589Z.yml`

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음 (IPv6 `::1` 주소 바인딩 경고가 있었으나 IPv4 `127.0.0.1`로 정상 통신 및 렌더링 확인됨).

## 5. 검증 (validation)
- **Playwright MCP 동작 검증**:
  - 브라우저 탐색 및 페이지 타이틀 수신 성공.
  - 생성된 스크린샷 파일 크기 30KB 정상 확인 ([localhost-5173-home.png](file:///C:/maple-info-app/ai/playwright/img/2026-11/localhost-5173-home.png)).
- **프로젝트 무결성 검증**:
  - `pnpm lint`: 에러 0개, 경고 1개 (기존 상태 유지).
  - `pnpm build`: 정상 빌드 완료 (`tsc -b && vite build` 1.19s).

## 6. 남은 할 일 (todo)
- [x] Python 3.12 설치 및 버전 확인 완료
- [x] Playwright MCP 서버 및 Chromium 브라우저 구동 확인 완료
- [x] localhost:5173 접속 테스트 및 캡처 산출물 정리 완료
- [ ] 메이플 정보 앱 신규 기능 개발 또는 E2E 시나리오 테스트 필요 시 Playwright MCP 적극 활용

## 7. 교훈 (lessons)
- Playwright MCP 도구를 통해 헤드리스 Chromium 브라우저를 간편하게 조작할 수 있으며, Vite 개발 서버가 동작 중일 때 실시간 UI 스냅샷과 캡처를 자동으로 수집하여 UI 검증 루프를 대폭 단축할 수 있습니다.
- MCP 도구 실행 과정에서 임시 디렉토리(`manual_images/`)에 생성되는 스냅샷 및 로그 파일은 프로젝트 규칙에 따라 즉시 시계열 디렉토리(`ai/playwright/text/YYYY-MM/`)로 정리해야 관리 일관성이 유지됩니다.
