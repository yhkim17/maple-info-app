# [작업] Playwright 산출물 디렉토리 년월(YYYY-MM) 서브디렉토리 구조화 및 GEMINI.md 규칙 명시

- **일자**: 2026-11-15
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- `playwright`(`ai/playwright`) 디렉토리 아래 `img`, `ppt`, `text` 디렉토리 하위에 `YYYY-MM` 형식으로 년월별 서브디렉토리를 생성하여 파일을 관리하도록 구조 개편.
- 기존에 존재하는 파일들을 해당 생성 시점/월에 맞추어 `YYYY-MM` 디렉토리로 이동.
- `GEMINI.md` 작업 규칙 문서에 향후 Playwright MCP를 통해 이미지(`img`) 및 텍스트(`text`), PPT(`ppt`) 파일 생성 시 `YYYY-MM` 형식 디렉토리 안에 생성/보관하도록 명시.

## 2. 계획 (plan)
1. **타겟 년월 서브디렉토리 생성**:
   - `ai/playwright/img/2026-11/`
   - `ai/playwright/ppt/2026-11/`
   - `ai/playwright/text/2026-11/`
2. **기존 산출물 파일 이동**:
   - `ai/playwright/img/` 내 파일들 -> `ai/playwright/img/2026-11/`로 이동
   - `ai/playwright/ppt/` 내 파일들 -> `ai/playwright/ppt/2026-11/`로 이동
   - `ai/playwright/text/` 내 파일들 -> `ai/playwright/text/2026-11/`로 이동
3. **규칙 문서(`GEMINI.md`) 갱신**:
   - `## 3. Playwright MCP 산출물 관리 규칙` 섹션 신설
   - 산출물 종류별 저장 디렉토리 및 `YYYY-MM` 서브폴더 관리 원칙 명시
4. **검증 및 빌드 확인**:
   - 디렉토리 구조 검증
   - `pnpm lint` 및 `pnpm build` 실행을 통해 프로젝트 정상 동작 확인

## 3. 실행 내역 (execution)
- **디렉토리 생성 및 파일 이동**:
  - `ai/playwright/img/2026-11/` 생성 후 PNG 파일 10개 이동 완료
  - `ai/playwright/ppt/2026-11/` 생성 후 PPTX 파일 1개 이동 완료
  - `ai/playwright/text/2026-11/` 생성 후 로그/스냅샷/설정 파일 18개 이동 완료
- **규칙 문서 수정 (`GEMINI.md`)**:
  - `## 3. Playwright MCP 산출물 관리 규칙` 추가:
    - `3-1. 저장 경로 구조 (YYYY-MM 형식 필수)`: `ai/playwright/img/YYYY-MM/`, `ai/playwright/text/YYYY-MM/`, `ai/playwright/ppt/YYYY-MM/`
    - `3-2. 생성 및 관리 원칙`: 생성 시점 년월 폴더 확인/생성 후 저장 및 임시 생성 파일의 즉시 분류 원칙 기재

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음 (파일 이동 및 디렉토리 생성 정상 수행)

## 5. 검증 (validation)
- **디렉토리 구조 검증**:
  - `ai/playwright/img/2026-11/`: 스크린샷 10개 보관 확인
  - `ai/playwright/ppt/2026-11/`: PPTX 파일 1개 보관 확인
  - `ai/playwright/text/2026-11/`: 콘솔 로그 2개, YML 스냅샷 15개, 세팅 가이드 1개 보관 확인
- **프로젝트 린트 및 빌드 검증**:
  - `pnpm lint`: 에러 0개 (경고 1개 유지)
  - `pnpm build`: 정상 빌드 완료 확인

## 6. 남은 할 일 (todo)
- [x] Playwright 산출물 폴더 년월별 서브디렉토리 분류 완료
- [x] GEMINI.md 산출물 관리 규칙 명시 완료
- [ ] 향후 브라우저 캡처/스냅샷 작업 시 지정된 YYYY-MM 경로로 파일 자동/수동 분류 유지

## 7. 교훈 (lessons)
- 산출물이 누적될수록 단일 디렉토리에 파일이 쌓여 탐색 및 관리가 어려워지므로, `YYYY-MM` 형태의 시계열 디렉토리 분할을 규칙화함으로써 장기적인 아티팩트 관리 효율성과 프로젝트 디렉토리 청결성을 확보할 수 있습니다.
