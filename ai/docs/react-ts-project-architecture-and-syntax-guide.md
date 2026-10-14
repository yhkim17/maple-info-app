# React & TypeScript 메이플 API 프로젝트 구조 및 문법 학습 가이드

본 문서는 React 19, TypeScript, TanStack Query, Tailwind CSS v4 기반의 메이플스토리 오픈 API 프로젝트 아키텍처와 핵심 문법, 데이터 흐름을 체계적으로 이해하기 위해 정리한 학습 문서입니다.

---

## 1. 프로젝트 아키텍처 및 디렉터리 구성

프로젝트는 **관심사의 분리(Separation of Concerns)** 원칙을 바탕으로 UI, 상태, API 통신 계층이 체계적으로 분리되어 있습니다.

```text
src/
├── main.tsx              # 앱의 시작점 (React Query Provider 설정 및 Root 마운트)
├── App.tsx               # 전체 화면 흐름과 전역 상태를 조율하는 메인 컨트롤러
├── api/                  # 넥슨 서버와 직접 통신하는 Axios 통신 계층
│   ├── index.ts          # 공통 Axios 인스턴스, 인터셉터, 범용 API 호출 함수
│   └── character.ts      # 캐릭터 OCID(고유 식별자) 단일 조회 API
├── components/           # UI 화면을 조각내어 만든 재사용 컴포넌트들
│   ├── CharacterSearch.tsx # [1단계] 닉네임 입력 및 유효성 검증 화면
│   ├── Navbar.tsx          # 상단 대메뉴 바 (캐릭터/유니온/길드/스케줄러 등)
│   ├── LeftSidebar.tsx     # 좌측 서브메뉴 바 (기본정보/장비/스킬 등)
│   ├── TabContent.tsx      # 우측 본문 (파라미터 조절 및 API 쿼리 트리거)
│   └── ApiDataViewer.tsx   # 응답 데이터 화면 표시 (JSON 및 커스텀 카드 뷰어)
├── constants/            # 메뉴 목록 및 엔드포인트 메타데이터
│   └── apiMenus.ts       # 넥슨 API 엔드포인트 목록 및 요구 파라미터 규격 정의
├── hooks/                # 비동기 데이터 조회 로직을 캡슐화한 커스텀 훅
│   └── useNexonApiQuery.ts # TanStack Query(React Query) 기반 캐싱 훅
└── types/                # TypeScript 타입 정의 모음
    ├── mapleApi.ts       # API 응답 데이터 모델 인터페이스
    └── navigation.ts     # 메뉴 및 파라미터 구조 타입
```

---

## 2. 전체적인 서비스 동작 및 데이터 흐름

### 2-1. 라이프사이클 다이어그램

```
[1. 메인 진입] 
  main.tsx (QueryClientProvider 설정) 
    └── App.tsx (상태 머신 역할)

[2. 캐릭터 검색 화면]
  character 상태가 null인가?
    ├── YES ──> <CharacterSearch /> 렌더링
    │             └── 검색 완료 시 onSearch(name, ocid) 콜백 실행
    │
    └── NO  ──> 메인 대시보드 레이아웃 렌더링
                  ├── <Navbar /> (대메뉴 변경: activeMenu)
                  ├── <LeftSidebar /> (소메뉴 변경: activeSubApiId)
                  └── <TabContent /> (조회 조건 파라미터 설정)
                        └── useNexonApiQuery (넥슨 서버 비동기 요청)
                              └── <ApiDataViewer /> (로딩/성공/에러 결과 표출)
```

### 2-2. 단계별 흐름 상세 설명

1. **초기화 (`main.tsx`)**:
   - `QueryClient` 인스턴스를 생성하고 `<QueryClientProvider client={queryClient}>`로 앱을 감싸 전역에서 API 캐싱이 가능하도록 준비합니다.
2. **캐릭터 검색 단계 (`App.tsx` & `CharacterSearch.tsx`)**:
   - `character` 상태의 초기값은 `null`입니다.
   - 조건부 렌더링(`if (!character)`)에 의해 첫 화면에는 검색창만 렌더링됩니다.
   - 사용자가 닉네임을 입력하고 확인을 누르면 `getCharacterOcid`를 호출하여 넥슨 서버에 존재하는 캐릭터인지 검증 후 고유 식별자(`ocid`)를 받아옵니다.
   - 성공 시 부모(`App.tsx`)의 `handleSearchSuccess(name, ocid)`가 실행되어 `character` 상태가 채워집니다.
3. **대시보드 전환**:
   - `character` 상태가 존재하게 되면 검색창 대신 **Navbar + LeftSidebar + TabContent**로 구성된 메인 화면이 열립니다.
4. **파라미터 조립 및 쿼리 트리거 (`TabContent.tsx`)**:
   - 사용자가 사이드바에서 보고 싶은 항목(예: 캐릭터 기본 정보, 장비, 스킬 등)을 선택합니다.
   - `constants/apiMenus.ts`에 정의된 메타데이터를 기반으로 현재 API가 필요로 하는 파라미터(`ocid`, `date`, `character_skill_grade` 등)를 `useMemo`로 조합합니다.
   - 이 파라미터를 인자로 넘겨 커스텀 훅 `useNexonApiQuery(endpoint, queryParams)`를 호출합니다.
5. **데이터 패칭 및 캐싱 (`useNexonApiQuery.ts` & `api/index.ts`)**:
   - TanStack Query가 전달받은 `['nexon-api', endpoint, params]` 키를 기준으로 캐시를 조회합니다.
   - 캐시가 없거나 만료되었으면 `fetchNexonApi` -> `Axios`를 거쳐 `https://open.api.nexon.com/maplestory/v1/...`로 실제 HTTP GET 요청을 전송합니다.
6. **화면 렌더링 (`ApiDataViewer.tsx`)**:
   - `useNexonApiQuery`가 반환하는 `{ data, isLoading, isError, error }` 상태를 받아 화면을 그립니다.
   - 로딩 중이면 스피너를, 에러 발생 시 안내 메시지를, 성공 시 가공된 UI(주간보스 카드, 장비 정보) 또는 JSON 뷰어로 시각화합니다.

---

## 3. 핵심 React & TypeScript 문법 및 개념 해설

### ① TypeScript 제네릭 (Generic, `<T>`)
API마다 서버에서 응답해 주는 데이터의 형태가 전부 다릅니다. 이때 **"어떤 타입이 들어올지 함수를 정의할 때가 아니라, 실제로 호출할 때 결정하겠다"**라고 타입을 매개변수처럼 넘겨주는 문법입니다.

```typescript
// src/api/index.ts
export async function fetchNexonApi<T = unknown>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const response = await api.get<T>(endpoint, { params: sanitizedParams });
  return response.data; // response.data가 T 타입으로 추론됨
}
```
* **사용 예시**: `fetchNexonApi<CharacterBasicInfo>('character/basic', { ocid })` 형태로 호출하면, 반환되는 데이터가 자동으로 `CharacterBasicInfo` 타입이 되어 코드 작성 시 자동 완성과 타입 검사가 지원됩니다.

---

### ② 상태 끌어올리기 (State Lifting)와 Props 콜백 함수
React의 데이터는 **부모에서 자식으로만 흐르는 단방향(One-way Data Flow)** 구조를 가집니다. 자식 컴포넌트에서 일어난 사건(예: 검색 성공)으로 부모의 상태를 변경해야 할 때, **부모가 자식에게 함수를 Props로 내려주고 자식이 그 함수를 호출**하는 패턴을 사용합니다.

```tsx
// [부모 컴포넌트: App.tsx]
function App() {
  const [character, setCharacter] = useState<CharacterData | null>(null);

  const handleSearchSuccess = (name: string, ocid: string) => {
    setCharacter({ name, ocid }); // 부모가 상태를 업데이트함
  };

  // 자식에게 함수를 props로 전달
  return <CharacterSearch onSearch={handleSearchSuccess} />;
}

// [자식 컴포넌트: CharacterSearch.tsx]
interface CharacterSearchProps {
  onSearch: (name: string, ocid: string) => void; // 전달받을 함수의 타입 규격 정의
}

export function CharacterSearch({ onSearch }: CharacterSearchProps) {
  const validateAndSearch = async (name: string) => {
    const ocid = await getCharacterOcid(name);
    if (ocid) {
      onSearch(name, ocid); // 검색 성공 시 부모가 준 함수를 실행!
    }
  };
}
```

---

### ③ 조건부 렌더링 패턴 (Early Return, 삼항 연산자, `&&`)
상황에 따라 다른 UI를 보여줄 때 사용하는 리액트의 표준 패턴입니다.

1. **Early Return (조기 반환)**
   ```tsx
   // App.tsx
   if (!character) {
     return <CharacterSearch onSearch={handleSearchSuccess} />;
   }
   // character가 null이 아닐 때만 아래 대시보드 코드가 실행됨
   return <div className="min-h-screen">...</div>;
   ```
2. **논리곱 연산자 단축 평가 (`&&`)**
   ```tsx
   {isLoading && <span>데이터 조회 중...</span>}
   // isLoading이 true일 때만 우측 컴포넌트가 화면에 나타납니다.
   ```
3. **삼항 연산자 (`condition ? trueElement : falseElement`)**
   ```tsx
   {isLoading ? <Spinner /> : <span>조회</span>}
   ```

---

### ④ 현대 JavaScript/TypeScript 핵심 연산자

#### Optional Chaining (`?.`)
객체의 프로퍼티를 깊게 탐색할 때 중간 값이 `null` 또는 `undefined`여도 에러(`TypeError: Cannot read properties of undefined`)를 던지지 않고 안전하게 `undefined`를 반환합니다.
```typescript
const firstSubApi = SUB_API_MENUS[menuId]?.[0];
// SUB_API_MENUS[menuId]가 존재하지 않으면 [0] 접근을 건너뛰고 안전하게 undefined 반환
```

#### Nullish Coalescing (`??`)
좌항의 값이 `null` 또는 `undefined`일 때만 우항의 기본값을 채택합니다. (`||` 연산자와 달리 `0`이나 `""`(빈 문자열)을 유효한 값으로 취급합니다.)
```typescript
const subApiId = SUB_API_MENUS.character[0]?.id ?? 'basic';
// 앞의 결과가 없으면 기본값으로 'basic'을 채택
```

---

### ⑤ 커스텀 훅과 TanStack Query (`useQuery`)의 역할
일반적인 리액트 초급 코드에서는 `useEffect` 안에서 API를 호출하고 `useState`로 로딩/에러/데이터 상태를 각각 관리합니다. 하지만 이 프로젝트에서는 이를 커스텀 훅으로 추상화했습니다.

```typescript
// src/hooks/useNexonApiQuery.ts
export function useNexonApiQuery<T = unknown>(
  endpoint: string,
  params?: Record<string, string | number | undefined>,
  enabled: boolean = true
) {
  return useQuery<T, Error>({
    queryKey: ['nexon-api', endpoint, params], // 엔드포인트나 파라미터가 바뀌면 자동으로 재요청
    queryFn: () => fetchNexonApi<T>(endpoint, params),
    enabled: enabled && !!endpoint,            // 조건이 충족될 때만 실행
    staleTime: 1000 * 60 * 3,                  // 3분간 캐시가 유지되어 불필요한 API 중복 호출 방지
  });
}
```

* **장점**:
  1. **네트워크 절약**: 사용자가 다른 탭에 갔다가 3분 안에 다시 돌아오면 서버를 다시 부르지 않고 캐시된 데이터를 즉시 보여줍니다.
  2. **선언적 코드**: 컴포넌트 내부에서 `const { data, isLoading, isError } = useNexonApiQuery(...)` 단 한 줄로 모든 비동기 상태를 다룰 수 있습니다.

---

## 4. 추천 코드 학습 순서

코드를 복습하거나 기능을 확장하고자 할 때 아래 순서대로 파일을 열람하는 것을 권장합니다:

1. **[`src/App.tsx`](../src/App.tsx)**: 전체 상태와 화면 전환의 뼈대 이해
2. **[`src/components/CharacterSearch.tsx`](../src/components/CharacterSearch.tsx)**: 폼 이벤트 처리, 비동기 호출 및 부모 콜백 실행 흐름 이해
3. **[`src/constants/apiMenus.ts`](../src/constants/apiMenus.ts)**: 데이터 모델 및 메뉴 구조 설계 파악
4. **[`src/hooks/useNexonApiQuery.ts`](../src/hooks/useNexonApiQuery.ts)** & **[`src/api/index.ts`](../src/api/index.ts)**: API 통신 모듈과 React Query의 연동 원리 이해
5. **[`src/components/TabContent.tsx`](../src/components/TabContent.tsx)**: 상태 변화에 따라 동적으로 API 파라미터를 빌드하는 `useMemo` 패턴 학습
6. **[`src/components/ApiDataViewer.tsx`](../src/components/ApiDataViewer.tsx)**: 대용량 데이터 시각화 및 조건별 렌더링 기법 학습
