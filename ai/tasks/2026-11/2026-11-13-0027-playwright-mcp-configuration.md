# Playwright MCP 서버 설정 가이드 및 Windows 환경 최적화

- **일자**: 2026-11-13
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- Playwright MCP 서버 설정을 위해 사용자가 제시한 설정 JSON 검토 및 적용 방안 안내:
  ```json
  {
    "mcpServers": {
      "playwright": {
        "command": "npx",
        "args": [
          "@playwright/mcp@latest",
          "--output-dir", "./manual_images",
          "--viewport-size", "1280x720"
        ]
      }
    }
  }
  ```
- Windows 환경 최적화 및 권장 설정(`cmd.exe /c`, `-y` 플래그)으로 실제 적용 요청 반영.

## 2. 계획 (plan)
1. **패키지 및 의존성 사전 검증**:
   - Node.js 버전(`v24.13.1`), Playwright 브라우저 설치 상태(Chromium-1254 설치됨) 확인.
   - `@playwright/mcp@latest` 패키지 및 CLI 옵션(`--output-dir`, `--viewport-size`) 유효성 검증.
2. **Antigravity 및 Windows 실행 환경 특성 분석**:
   - 전역 MCP 설정 파일 위치: `C:\Users\kimyu\.gemini\config\mcp_config.json`
   - Windows의 npx 배치 파일(`.cmd`) 실행 특성 및 `ENOENT` 방지 방안(`cmd.exe /c` 래핑).
   - npx 대화형 프롬프트 방지를 위한 `-y` 플래그 추가 필요성 점검.
3. **설정 파일 반영 및 검증**:
   - `C:\Users\kimyu\.gemini\config\mcp_config.json`에 최적화된 JSON 설정 작성 및 확인.

## 3. 실행 내역 (execution)
- 시스템 환경 확인:
  - Node.js `v24.13.1`
  - Playwright CLI `1.65.0`, Chromium 바이너리 정상 설치 확인.
- 설정 파일 반영:
  - 대상 파일: `C:\Users\kimyu\.gemini\config\mcp_config.json`
  - Windows 최적화 권장 설정을 `mcp_config.json`에 기록 완료:
    ```json
    {
      "mcpServers": {
        "playwright": {
          "command": "cmd.exe",
          "args": [
            "/c",
            "npx",
            "-y",
            "@playwright/mcp@latest",
            "--output-dir",
            "./manual_images",
            "--viewport-size",
            "1280x720"
          ]
        }
      }
    }
    ```

## 4. 에러/트러블슈팅 (errors)
- **Windows npx 대화형 먹통 방지**:
  - `npx` 명령 실행 시 `-y` 플래그가 누락되면 설치 확인 프롬프트 대기로 인해 stdio 통신이 멈출 수 있으므로 `args`에 `-y` 추가 반영.
- **Windows 실행 경로 ENOENT 방지**:
  - Windows 환경의 MCP 러너 특성에 맞추어 `cmd.exe /c npx` 형태로 작성하여 호환성 문제 사전 차단.

## 5. 검증 (validation)
- `C:\Users\kimyu\.gemini\config\mcp_config.json` 파일 읽기 및 JSON 구문 오류 없음 확인.
- `npx -y @playwright/mcp@latest --help` 사전 실행으로 바이너리 및 인자 규격 검증 완료.

## 6. 남은 할 일 (todo)
- [x] `C:\Users\kimyu\.gemini\config\mcp_config.json`에 설정 파일 자동 반영 완료.
- [ ] Antigravity 재시작 또는 새 세션 시작 시 Playwright MCP 툴 노출 여부 확인.

## 7. 교훈 (lessons)
- Windows 환경에서 npx 기반의 MCP 서버를 설정할 때는 interactive 프롬프트 방지(`-y`)와 `.cmd` 실행 호환성을 고려한 명령 구성을 기본 권장안으로 제시해야 실패 없는 구동이 가능함.
