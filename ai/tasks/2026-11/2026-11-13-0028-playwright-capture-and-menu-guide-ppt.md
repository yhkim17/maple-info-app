# [작업] Playwright MCP 활용 로컬 화면 전체 캡처 및 메뉴별 기능 설명 PPT 작성

- **일자**: 2026-11-13
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- Playwright MCP를 활용하여 로컬 개발 서버(`http://localhost:5173`)에 접속.
- 메인 화면 및 각 메뉴별 전체화면 스크린샷 캡처 수행.
- 메이플 인포 앱의 메뉴별 주요 기능과 가치를 간략하게 정리한 프레젠테이션(PPTX) 문서 작성.

## 2. 계획 (plan)
1. **서버 및 도구 상태 점검**:
   - `http://localhost:5173` 개발 서버 정상 동작(HTTP 200) 여부 확인.
   - Playwright MCP Lazy 툴 스키마(`browser_navigate`, `browser_resize`, `browser_take_screenshot`, `browser_click` 등) 확인.
2. **화면 탐색 및 전체화면 캡처**:
   - 브라우저 해상도를 1920x1080 와이드 규격으로 설정.
   - 메인 캐릭터 검색 화면 전체 캡처 (`screenshots/00_main_search.png`).
   - 추천 닉네임(ColdZone)을 통해 캐릭터 상세 대시보드로 진입.
   - 상단 8개 네비게이션 메뉴를 순차 클릭하며 각각 전체화면 캡처:
     - 01. 캐릭터 정보 조회 (`01_menu_character.png`)
     - 02. 유니온 정보 조회 (`02_menu_union.png`)
     - 03. 길드 정보 조회 (`03_menu_guild.png`)
     - 04. 연무장 정보 조회 (`04_menu_training.png`)
     - 05. 확률 정보 조회 (`05_menu_probability.png`)
     - 06. 스케줄러 정보 조회 (`06_menu_scheduler.png`)
     - 07. 랭킹 정보 조회 (`07_menu_ranking.png`)
     - 08. 공지 정보 조회 (`08_menu_notice.png`)
3. **메뉴별 상세 정보 및 기능 추출**:
   - `src/constants/apiMenus.ts`와 `src/types/navigation.ts` 코드를 분석하여 메뉴별 세부 API 리스트와 엔드포인트 파악.
4. **프레젠테이션(PPTX) 자동 생성**:
   - `python-pptx` 라이브러리를 활용하여 16:9 다크 모던 테마의 슬라이드 덱 구축.
   - 캡처된 실제 스크린샷 이미지를 슬라이드 좌측에 배치하고, 우측에 메뉴별 기능, 포함 API, 활용 포인트를 카드 형태로 구조화.
5. **검증 및 문서화**:
   - PPTX 파일 무결성 및 용량 확인, GEMINI 규칙에 따른 작업 일지 작성.

## 3. 실행 내역 (execution)
- **화면 캡처 실행 (Playwright MCP)**:
  - `browser_resize`: `{ width: 1920, height: 1080 }`
  - `browser_navigate`: `http://localhost:5173/` 접속 확인
  - `browser_take_screenshot`: 총 9장의 고해상도 전체화면 스크린샷 생성 및 `screenshots/` 폴더에 저장.
  - `browser_close`: 리소스 정상 정리.
- **PPTX 생성 스크립트 작성 및 실행**:
  - 스크립트: `scratch/generate_ppt.py`
  - 슬라이드 구성 (총 12장):
    - Slide 1: 표지 (메이플 인포 종합 가이드)
    - Slide 2: 목차 및 시스템 아키텍처 개요 (8대 메뉴 요약)
    - Slide 3: 메인 검색 화면 및 UI/UX 구조
    - Slide 4~11: 8대 메뉴별 상세 슬라이드 (캡처 스크린샷 + 기능 설명 + 하위 API 목록 + 활용 포인트)
    - Slide 12: 기술 아키텍처 및 종합 요약 (React 19, TypeScript, Tailwind v4, TanStack Query v5)
  - 최종 생성물: `메이플_인포_앱_메뉴별_기능_가이드.pptx` (약 1.02 MB)

## 4. 에러/트러블슈팅 (errors)
- **PowerShell 인라인 스크립트 특수문자 파싱 에러**:
  - `python -c` 및 `node -e` 인라인 명령 실행 시 PowerShell의 따옴표(`"`, `'`) 및 괄호 파싱 충돌 발생.
  - **해결**: scratch 디렉터리에 독립 스크립트 파일(`parse_menus.cjs`, `generate_ppt.py`)을 작성하여 안정적으로 실행 완료.

## 5. 검증 (validation)
- **스크린샷 생성 검증**: `screenshots/` 내 9개 이미지 파일 크기 및 포맷 정상 저장 확인.
- **PPTX 생성 검증**: `D:\maple-info-app\메이플_인포_앱_메뉴별_기능_가이드.pptx` 파일 생성 확인 (1,026,017 Bytes).
- **Playwright 브라우저 종료**: `browser_close` 호출로 백그라운드 Chromium 프로세스 정상 종료 확인.

## 6. 남은 할 일 (todo)
- [ ] 필요 시 사용자 피드백을 반영하여 특정 슬라이드 내용 보강 또는 레이아웃 튜닝.
- [ ] 인게임 스타일 컴포넌트(장비 툴팁 팝업 등)의 인터랙티브 상세 화면 캡처 추가 슬라이드 제작.

## 7. 교훈 (lessons)
- Playwright MCP를 사용하면 브라우저 내 클릭, 네비게이션, 스크린샷 등의 E2E 조작을 에이전트 내에서 실시간으로 완벽하게 제어할 수 있습니다.
- `python-pptx`를 통해 실제 캡처한 이미지와 코드베이스의 메타데이터를 결합하면 빠르고 완성도 높은 시각화 보고서 자료를 자동 생성할 수 있습니다.
