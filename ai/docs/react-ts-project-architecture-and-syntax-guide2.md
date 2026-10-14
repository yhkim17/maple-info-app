  React와 TypeScript를 처음 접하실 때 AI가 작성한 코드를 보면 문법이나 데이터 흐름이 복잡하게 얽혀 있어 이해하기 어려우셨을 수 있습니다.

  이 프로젝트가 어떤 구조로 나뉘어 있고, 데이터가 어떻게 흘러가며, 핵심 문법들이 각각 어떤 역할을 하는지 단계별로 이해하기 쉽게 정리해 드리겠습니다.
  ──────
  ### 1. 한눈에 보는 프로젝트 디렉터리 구조

  프로젝트는 관심사의 분리(Separation of Concerns) 원칙에 따라 디렉터리가 깔끔하게 나뉘어 있습니다.

    src/
    ├── main.tsx              # 앱의 시작점 (React Query Provider 설정)
    ├── App.tsx               # 전체 화면 흐름을 조율하는 메인 컨트롤러
    ├── api/                  # 넥슨 서버와 직접 통신하는 Axios 통신 계층
    │   ├── index.ts          # 공통 Axios 인스턴스 및 범용 API 호출 함수
    │   └── character.ts      # 캐릭터 OCID(식별자) 단일 조회 API
    ├── components/           # UI 화면을 조각내어 만든 재사용 컴포넌트들
    │   ├── CharacterSearch.tsx # [1단계] 닉네임 입력 및 확인 화면
    │   ├── Navbar.tsx          # 상단 대메뉴 바 (캐릭터/유니온/길드/스케줄러 등)
    │   ├── LeftSidebar.tsx     # 좌측 서브메뉴 바 (기본정보/장비/스킬 등)
    │   ├── TabContent.tsx      # 우측 본문 (파라미터 조절 및 API 호출 트리거)
    │   └── ApiDataViewer.tsx   # 응답 데이터 화면 표시 (JSON 및 시각화 카드)
    ├── constants/            # 메뉴 목록 및 고정 메타데이터
    │   └── apiMenus.ts       # 넥슨 API 엔드포인트 목록 및 파라미터 정의
    ├── hooks/                # 비동기 데이터 조회 로직을 캡슐화한 커스텀 훅
    │   └── useNexonApiQuery.ts # TanStack Query(React Query) 래퍼
    └── types/                # TypeScript 타입 정의 모음
        ├── mapleApi.ts       # API 응답 데이터 모델 인터페이스
        └── navigation.ts     # 메뉴 및 파라미터 구조 타입
  ──────
  ### 2. 전체적인 서비스 동작 및 데이터 흐름

    [1. 메인 진입]
      main.tsx (QueryClientProvider 설정)
        └── App.tsx

    [2. 캐릭터 검색 화면]
      character가 null인가?
        ├── YES ──> <CharacterSearch /> 렌더링
        │             └── 검색 완료 시 handleSearchSuccess(name, ocid) 호출
        └── NO  ──> 대시보드 레이아웃 렌더링
                      ├── <Navbar /> (대메뉴 선택)
                      ├── <LeftSidebar /> (소메뉴 선택)
                      └── <TabContent /> (조회 조건 설정)
                            └── useNexonApiQuery (넥슨 서버 요청)
                                  └── <ApiDataViewer /> (데이터 화면 출력)

  1. 시작: main.tsx에서 QueryClientProvider로 앱 전체를 감싸서 TanStack Query(캐싱 및 비동기 상태 관리)를 활성화합니다.
  2. 검색 단계: App.tsx:43-45에서 character 상태가 비어있으면 CharacterSearch를 보여줍니다. 유효한 닉네임인지 넥슨 API로 검증(getCharacterOcid)한 뒤 ocid를 얻으면 character 상태에 저장합니다.
  3. 대시보드 전환: 캐릭터가 등록되면 검색창이 사라지고 상단바 + 좌측 사이드바 + 우측 본문 화면으로 바뀝니다.
  4. API 조회 트리거:
      • 사용자가 메뉴를 클릭하면 activeMenu와 activeSubApi가 바뀝니다.
      • TabContent.tsx가 현재 선택된 API 메뉴와 파라미터(날짜, OCID 등)를 모아서 useNexonApiQuery에 넘깁니다.
  5. 데이터 패칭 및 렌더링:
      • useNexonApiQuery가 캐시를 확인하고, 없으면 fetchNexonApi를 통해 넥슨 API 서버로 요청합니다.
      • 로딩/성공/실패 상태를 ApiDataViewer.tsx에 전달하여 카드 뷰나 JSON 형태로 화면에 렌더링합니다.

  ──────
  ### 3. 코드에서 자주 보이는 핵심 문법 & 개념 정리

  #### ① TypeScript의 제네릭 (Generic, <T>)

  API를 호출할 때 응답 데이터의 형태는 '기본 정보', '장비 정보', '길드 정보'마다 다릅니다. 이때 **"어떤 타입이 들어올지 나중에 호출하는 곳에서 결정하겠다"**라고 열어두는 문법입니다.

    // src/api/index.ts
    export async function fetchNexonApi<T = unknown>(endpoint: string, params?: ...): Promise<T> {
      const response = await api.get<T>(endpoint, { params });
      return response.data; // response.data의 타입이 T가 됩니다.
    }

  • <T = unknown>: 타입을 지정하지 않으면 기본값으로 unknown을 쓰고,
  • fetchNexonApi<CharacterBasicInfo>(...)처럼 호출하면 결과값의 타입이 자동으로 CharacterBasicInfo가 됩니다. (자동완성과 오타 검사가 작동함)
  ──────
  #### ② 상태 끌어올리기 (State Lifting)와 Props 콜백

  React에서는 데이터(State)는 부모에서 자식으로만 내려가고(단방향 데이터 흐름), 자식이 부모의 상태를 바꾸고 싶을 때는 부모가 건네준 **함수(콜백)**를 실행해야 합니다.

    // 1. 부모 (App.tsx)
    const [character, setCharacter] = useState<CharacterData | null>(null);

    const handleSearchSuccess = (name: string, ocid: string) => {
      setCharacter({ name, ocid }); // 부모가 상태를 변경함
    };

    return <CharacterSearch onSearch={handleSearchSuccess} />;

    // 2. 자식 (CharacterSearch.tsx)
    interface CharacterSearchProps {
      onSearch: (name: string, ocid: string) => void; // 부모에게 전달받은 함수 규격
    }

    export function CharacterSearch({ onSearch }: CharacterSearchProps) {
      const validateAndSearch = async (name: string) => {
        const ocid = await getCharacterOcid(name);
        onSearch(name, ocid); // 검색 성공 시 부모의 함수를 호출!
      };
    }
  ──────
  #### ③ 조건부 렌더링 (Early Return, 삼항 연산자, &&)

  React에서 상황에 따라 다른 화면을 그릴 때 자주 쓰이는 패턴입니다.

  1. Early Return (조기 반환)
    // App.tsx
    if (!character) {
      return <CharacterSearch onSearch={handleSearchSuccess} />;
    }
    // character가 있을 때만 아래 메인 화면 코드가 실행됩니다.
    return <div className="min-h-screen">...</div>;

  2. 단축 평가 (&&)
    {isLoading && <span>로딩 중...</span>}
    // isLoading이 true일 때만 우측의 <span>이 화면에 그려집니다.

  3. 삼항 연산자 (A ? B : C)
    {isLoading ? <LoadingSpinner /> : '확인'}

  ──────
  #### ④ 현대 JS/TS 필수 연산자: ?. 와 ??

  • Optional Chaining (?.): 객체가 null 또는 undefined일 때 에러(Cannot read properties of undefined)가 나지 않고 그냥 undefined를 반환합니다.
    const firstSubApi = SUB_API_MENUS[menuId]?.[0];
    // SUB_API_MENUS[menuId]가 없으면 [0]에 접근하지 않고 멈춤

  • Nullish Coalescing (??): 앞의 값이 null이거나 undefined일 때만 기본값을 채택합니다.
    SUB_API_MENUS.character[0]?.id ?? 'basic'
    // 앞의 값이 없으면 기본값 'basic' 사용

  ──────
  #### ⑤ 왜 useEffect 대신 TanStack Query (useNexonApiQuery)를 쓸까?

  React 초보 단계에서는 흔히 useEffect 안에 axios.get을 넣고 useState로 로딩과 데이터를 직접 관리합니다.
  하지만 이 프로젝트에서는 useNexonApiQuery를 사용합니다.

    export function useNexonApiQuery<T = unknown>(endpoint: string, params?: Record<string, any>, enabled: boolean = true) {
      return useQuery<T, Error>({
        queryKey: ['nexon-api', endpoint, params], // 이 키 배열이 바뀌면 자동으로 재조회
        queryFn: () => fetchNexonApi<T>(endpoint, params),
        enabled: enabled && !!endpoint,            // 조건이 맞을 때만 실행
        staleTime: 1000 * 60 * 3,                  // 3분 동안은 동일한 요청 시 서버 호출 없이 캐시 재사용
      });
    }

  • 자동 캐싱: 탭을 왔다 갔다 해도 3분간은 다시 네트워크 요청을 보내지 않아 속도가 즉각적입니다.
  • 간결한 코드: { data, isLoading, isError, error }를 라이브러리가 한 번에 관리해 주므로 수십 줄의 상태 관리 코드가 1~2줄로 줄어듭니다.
  ──────
  ### 4. 추천 학습 로드맵

  코드를 파악하실 때 아래 순서대로 파일을 열어보시면 흐름이 자연스럽게 이어집니다:

  1. App.tsx: 전체 레이아웃과 상태(character, activeMenu)가 어떻게 연결되는지 파악
  2. CharacterSearch.tsx: useState와 사용자 입력 폼 처리, 비동기 호출 기본기 확인
  3. apiMenus.ts: 메뉴와 넥슨 엔드포인트가 어떤 구조로 설계되어 있는지 확인
  4. useNexonApiQuery.ts & index.ts: API 통신과 React Query 캐싱 원리 확인
  5. TabContent.tsx: 사용자 선택에 따라 쿼리 파라미터를 동적으로 조립하는 useMemo 활용법 확인

  코드 중 특정 줄이나 추가로 이해하기 힘든 문법(예: useMemo, Promise.all, TypeScript의 type vs interface 등)이 있으시면 언제든 편하게 질문해 주세요!