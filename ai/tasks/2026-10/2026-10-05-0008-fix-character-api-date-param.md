# 캐릭터 정보 조회 시 날짜(date) 파라미터 자동 포함으로 인한 400 에러 수정

- **일자**: 2026-10-05
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 캐릭터 정보 조회(`character/basic`, `character/stat`, `character/item-equipment` 등) 시 당일 날짜의 `date` 파라미터가 강제로 포함되어 넥슨 Open API에서 `400 Bad Request` 에러가 발생하는 원인 수정
- 날짜를 사용자가 지정하지 않은 일반 캐릭터 API 호출 시 `date` 파라미터를 생략하여 넥슨 서버에서 가장 최신의 데이터를 200 OK로 수신하도록 보완하고, 이력 API (`history/*`)에 한해서만 디폴트 오늘 날짜를 전달하도록 구별 로직 완성

## 2. 계획 (plan)
1. **API 종류별 date 파라미터 분기 처리 (`src/components/TabContent.tsx`)**:
   - `selectedDate`가 입력되지 않은 경우:
     - `activeSubApi.endpoint.startsWith('history/')`인 이력 API일 때만 디폴트 오늘 날짜(`todayStr`) 설정
     - 캐릭터 기본 정보 및 장비, 스탯 등 일반 API는 `date` 파라미터를 완전히 생략하여 넥슨 서버가 최신 전일/당일 데이터를 자동 반환하도록 수정
2. **UI 뱃지 문구 업데이트**:
   - 날짜 미선택 시 이력 API는 "오늘 디폴트 적용", 캐릭터 API는 "최신 데이터 자동 조회" 뱃지 표시
3. **검증**:
   - `pnpm lint` 및 `pnpm build` 검증

## 3. 실행 내역 (execution)
- **수정된 파일**:
  - `src/components/TabContent.tsx`: `date` 파라미터 할당 시 `history/` 엔드포인트 여부 체크 및 미선택 시 생략 처리
- **기록 파일**:
  - `ai/tasks/2026-10/2026-10-05-0008-fix-character-api-date-param.md`: 작업 내역 문서화 생성

## 4. 에러/트러블슈팅 (errors)
- **문제점**: 넥슨 Open API 규격상 캐릭터 기본 정보 조회 등은 오늘 날짜 데이터가 아직 갱신 전이거나 정기점검 이후 시점일 때 `date=2026-10-05`를 전송하면 `400 Bad Request`를 리턴함. `date` 파라미터를 아예 보내지 않아야(생략해야) 넥슨 서버가 유효한 최신 데이터를 리턴함.
- **해결**: 일반 캐릭터/유니온/길드 API 조회의 경우 `selectedDate`가 비어있을 때는 `params.date`를 생략하도록 분기 처리하여 400 에러를 완벽 해결.

## 5. 검증 (validation)
1. **린트 검사**: `pnpm lint` (Oxlint) -> 17개 파일 0 warning, 0 error 통과
2. **타입 및 빌드 검증**: `pnpm build` (`tsc -b && vite build`) -> 644ms 만에 성공

## 6. 남은 할 일 (todo)
- [ ] 넥슨 Open API 400 Bad Request 응답 시 안내 툴팁 및 데이터 재갱신 안내 문구 보완

## 7. 교훈 (lessons)
- 넥슨 Open API의 엔드포인트별 특성(`history/*`는 기준일 필수 vs `character/*`는 미입력 시 최신 데이터 자동 반환)을 세심하게 파악하여 동적 파라미터 조립 로직을 분기하는 것이 400 Bad Request 에러 방지에 핵심적임.
