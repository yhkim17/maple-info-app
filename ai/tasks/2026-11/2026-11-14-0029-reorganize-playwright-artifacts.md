# [작업] Playwright 산출물 디렉토리 구조화 및 아티팩트 정리 (ai/playwright/img, text, ppt)

- **일자**: 2026-11-14
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 프로젝트 루트 및 작업 디렉토리에 산재되어 있던 PPT 문서, `manual_images` 디렉토리, `screenshots` 디렉토리를 체계적으로 정리.
- `ai/` 디렉토리 하위에 `playwright/` 폴더를 생성하고, 유형별 서브디렉토리(`img`, `text`, `ppt`)를 구성하여 관련 파일들을 적절히 이동 및 분류.

## 2. 계획 (plan)
1. **타겟 디렉토리 구조 생성**:
   - `ai/playwright/img/` : 브라우저 캡처 이미지(`.png`) 보관
   - `ai/playwright/text/` : Playwright 세션 콘솔 로그(`.log`) 및 페이지 스냅샷(`.yml`) 보관
   - `ai/playwright/ppt/` : 생성된 프레젠테이션 파일(`.pptx`) 보관
2. **파일 이동 및 디렉토리 정리**:
   - `screenshots/` 내 PNG 파일들을 `ai/playwright/img/`로 이동
   - `manual_images/` 내 로그/스냅샷 파일들을 `ai/playwright/text/`로 이동
   - 루트의 `메이플_인포_앱_메뉴별_기능_가이드.pptx`를 `ai/playwright/ppt/`로 이동
   - 비워진 `screenshots` 및 `manual_images` 폴더 삭제하여 프로젝트 루트 정리
3. **관련 자동화 스크립트 경로 동기화**:
   - `scratch/generate_ppt.py`의 이미지 로드 경로 및 PPT 저장 경로를 새 디렉토리(`ai/playwright/`)에 맞추어 수정.
4. **검증 및 빌드 확인**:
   - 파일 이동 및 디렉토리 구조 검증, `pnpm build` 및 `pnpm lint` 정상 확인.

## 3. 실행 내역 (execution)
- **디렉토리 생성**:
  - `ai/playwright/img`
  - `ai/playwright/text`
  - `ai/playwright/ppt`
- **파일 이동**:
  - `screenshots/*.png` (9개 이미지) -> `ai/playwright/img/`
  - `manual_images/*` (10개 .log / .yml 파일) -> `ai/playwright/text/`
  - `메이플_인포_앱_메뉴별_기능_가이드.pptx` -> `ai/playwright/ppt/`
- **기존 디렉토리 정리**:
  - `screenshots`, `manual_images` 폴더 삭제 완료.
- **스크립트 수정**:
  - `scratch/generate_ppt.py`의 `img_dir`를 `ai/playwright/img`로, `output_path`를 `ai/playwright/ppt/메이플_인포_앱_메뉴별_기능_가이드.pptx`로 업데이트.

## 4. 에러/트러블슈팅 (errors)
- 해당 사항 없음 (파일 이동 및 경로 업데이트 정상 수행)

## 5. 검증 (validation)
- **디렉토리 트리 확인**:
  - `ai/playwright/img/` : `00_main_search.png` ~ `08_menu_notice.png` (9개 파일 정상 위치)
  - `ai/playwright/text/` : 콘솔 로그 1개, YML 스냅샷 9개 보관 확인
  - `ai/playwright/ppt/` : `메이플_인포_앱_메뉴별_기능_가이드.pptx` (1,026,017 Bytes 정상 위치)
- **프로젝트 빌드/린트 확인**:
  - `pnpm build`: 에러 없이 2.91s 만에 빌드 성공
  - `pnpm lint`: 에러 0개 (경고 1개 유지)

## 6. 남은 할 일 (todo)
- [ ] 향후 Playwright MCP 테스트 실행 시 산출물이 `ai/playwright/` 하위로 자동 저장되도록 설정 유지.

## 7. 교훈 (lessons)
- Playwright MCP나 E2E 테스트 과정에서 자동으로 생성되는 스냅샷, 로그 및 캡처 이미지는 프로젝트 루트를 오염시키기 쉬우므로, `ai/playwright/{img, text, ppt}`와 같이 명확한 데이터 파이프라인 디렉토리를 사전에 구축하여 관리하는 것이 프로젝트 유지보수성에 유리합니다.
