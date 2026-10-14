# 캐릭터 스케줄러 API 타 계정 캐릭터 조회 실패 원인 분석 (넥슨 OpenAPI 계정 귀속 정책)

- **일자**: 2026-10-10
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- `ColdZone`, `BishopZone`, `ChIlliumZone`, `ChBeMeZone` 캐릭터명은 정상 조회되나, `꾹꾹코스터`, `헤카피` 등 다른 캐릭터명 입력 시 정상적으로 결과값을 가져오지 못하는 원인 규명 및 기술적 설명.

## 2. 계획 (plan)
1. **API 호출 단위 테스트 (Node.js)**:
   - `id` 엔드포인트: `ColdZone`, `꾹꾹코스터`, `헤카피` 모두 정상 OCID 발급 여부 확인.
   - `scheduler/character-state` 엔드포인트: 각 캐릭터의 OCID로 호출하여 응답 코드 및 에러 메시지 확인.
2. **넥슨 OpenAPI 공식 정책 및 스펙 대조**:
   - 일반 캐릭터 정보(`character/*`, `union/*` 등) vs 스케줄러 정보(`scheduler/character-state`)의 권한 차이 분석.
3. **사용자 가이드 및 대응 방안 제시**:
   - 본인 계정 캐릭터만 조회 가능한 넥슨 보안 정책 설명.
   - 타 계정 캐릭터 입력 시 UI 상의 안내 처리 확인.

## 3. 실행 내역 (execution)
- **API 실서버 응답 검증**:
  - `ColdZone`: `id` 200 OK (`c254af...`), `scheduler/character-state` 200 OK.
  - `꾹꾹코스터`: `id` 200 OK (`714cda...`), `scheduler/character-state` 400 Bad Request (`OPENAPI00004: Please input valid parameter`).
  - `헤카피`: `id` 200 OK (`30e2a4...`), `scheduler/character-state` 400 Bad Request (`OPENAPI00004: Please input valid parameter`).

## 4. 에러/트러블슈팅 (errors)
- **원인 규명**:
  - 넥슨 Open API 규격상 `GET /maplestory/v1/scheduler/character-state`는 **"API 키를 발급받은 계정에 소속된 캐릭터만 조회 가능"**하도록 설계된 개인 스케줄러 보안 API임.
  - `ColdZone`, `BishopZone`, `ChIlliumZone`, `ChBeMeZone`은 사용자의 API 키 발급 계정에 속한 캐릭터이므로 정상 조회됨.
  - `꾹꾹코스터`, `헤카피` 등은 타 유저의 계정에 속한 캐릭터이므로 `id` 조회(공개 식별자)는 성공하지만, 스케줄러 상태 조회 시 넥슨 서버에서 권한 제한으로 인해 `OPENAPI00004` 에러를 반환함.

## 5. 검증 (validation)
- 실서버 API 호출을 통해 동일한 API 키와 파라미터 규격 하에서 계정 소유 여부에 따라 200 vs 400 응답이 명확히 갈림을 입증.

## 6. 남은 할 일 (todo)
- [ ] 타 계정 캐릭터 입력 시 테스트/시연 목적의 가상(Mock) 시뮬레이션 데이터 표시 모드 지원 여부 사용자 피드백 수렴.

## 7. 교훈 (lessons)
- 메이플스토리 OpenAPI의 대부분 엔드포인트(장비, 스탯, 랭킹 등)는 전 유저 공개 데이터이지만, 스케줄러(`scheduler/*`)와 같은 인게임 숙제/수행 현황 데이터는 계정 소유자 본인에게만 제공되는 개인정보성 API이므로 UI 안내 문구에 이를 명시해야 함.
