# 메이플 Open API OCID 조회 기반 캐릭터 유효성 검증

- **일자**: 2026-10-04
- **작업자**: AI (Antigravity) & 사용자

## 1. 요청/목표 (goal)
- 메인 화면에서 사용자가 캐릭터명 입력 시 넥슨 Open API(`/maplestory/v1/id`)를 호출하여 실제 존재하는 캐릭터인지 유효성 검증(Validation check) 수행
- 실제 존재하는 캐릭터인 경우에만 식별자(`ocid`)를 획득하고 다음 화면(상단바 및 상세 메뉴)으로 진입
- 존재하지 않거나 유효하지 않은 캐릭터명일 경우 `alert('유효한 캐릭터명을 입력해주세요.')` 안내창 띄우기
- 프로젝트 내 `.env`의 `VITE_NEXON_API_KEY`를 활용하여 안전하게 통신

## 2. 계획 (plan)
1. 넥슨 오픈 API 엔드포인트(`/maplestory/v1/id?character_name=...`)의 정상 및 비정상 응답 스펙 테스트 검증
2. Axios 인스턴스(`src/api/index.ts`)를 활용하여 캐릭터 식별자 조회 함수(`getCharacterOcid`) 모듈 작성 (`src/api/character.ts`)
3. `CharacterSearch` 컴포넌트에 API 연동 및 비동기 검증 로직 연결
   - 요청 중 중복 제출 방지 및 로딩 상태(`isLoading`), 스피너 UI 제공
   - 성공 시 상위 컴포넌트로 캐릭터명과 `ocid` 전달
   - 실패(400 에러 등 null 반환) 시 요구된 alert 창 표시
4. `App.tsx` 및 `TabContent.tsx`에서 인증된 `ocid`를 상태로 저장 및 표시하도록 업데이트
5. Oxlint 및 TypeScript 컴파일 빌드로 무결성 확인

## 3. 실행 내역 (execution)
- **생성된 파일**:
  - `src/api/character.ts`: `getCharacterOcid` 비동기 API 통신 함수 (존재 시 `ocid` 반환, 부재 시 `null` 반환)
- **수정된 파일**:
  - `src/components/CharacterSearch.tsx`: `getCharacterOcid` 호출 기반 유효성 검사, 로딩 스피너 및 disabled 처리
  - `src/App.tsx`: 캐릭터 정보 객체 `{ name, ocid }`를 상태로 보관하도록 개선
  - `src/components/TabContent.tsx`: 검증 통과된 실제 `ocid` 값을 화면에 표시
- **기록 파일**:
  - `ai/tasks/2026-10/2026-10-04-character-ocid-validation.md`: 작업 내역 작성

## 4. 에러/트러블슈팅 (errors)
- **에러**: Oxlint에서 `src/api/character.ts`의 catch 블록 미사용 에러 파라미터 경고 발생 (`eslint(no-unused-vars): Catch parameter 'error' is caught but never used.`)
- **해결**: ES2019의 Optional catch binding 문법(`catch { ... }`)을 적용하여 불필요한 파라미터 선언을 제거하고 린트 경고 0건으로 해결.

## 5. 검증 (validation)
1. **API 실제 호출 테스트**:
   - 실존 캐릭터(`타락파워전사`): `ocid: "c01a602458774d6e19be4587c77d1c9b"` 수신 성공 (HTTP 200)
   - 미존재 캐릭터(`qwkejhqwekrjhaskldjh`): HTTP 400 Bad Request 수신 후 `null` 정상 반환 및 alert 분기 처리 확인
2. **린트 검사**: `pnpm lint` (Oxlint) 0 warning, 0 error 통과
3. **타입 및 빌드 검증**: `pnpm build` (`tsc -b && vite build`) 정상 통과

## 6. 남은 할 일 (todo)
- [ ] 발급된 `ocid`를 이용해 `/maplestory/v1/character/basic` 호출하여 실제 캐릭터 외형 이미지, 직업, 레벨 연동
- [ ] TanStack Query(`useQuery`) 도입을 통한 캐싱 및 비동기 상태 선언형 관리 리팩토링
- [ ] 유니온 정보 조회 등 서브 메뉴별 엔드포인트 연동 확장

## 7. 교훈 (lessons)
- 넥슨 Open API는 존재하지 않는 캐릭터 조회 시 404가 아닌 `400 Bad Request`와 에러 메시지를 반환하므로, Axios의 `try...catch` 구문에서 400 응답을 정상적인 미존재 분기로 우아하게 처리해야 함.
- 비동기 유효성 검사 중 사용자의 재클릭을 막기 위해 `isLoading` 상태를 두고 인풋과 버튼을 `disabled` 처리하는 것이 UX 및 API 할당량 보호에 필수적임.
