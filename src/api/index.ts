import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://open.api.nexon.com/maplestory/v1/',
  headers: {
    'Content-Type': 'application/json',
    'x-nxopen-api-key': import.meta.env.VITE_NEXON_API_KEY,
  },
});

api.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_NEXON_API_KEY;
    if (apiKey) {
      config.headers['x-nxopen-api-key'] = apiKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * 범용 넥슨 오픈 API 호출 함수
 */
export async function fetchNexonApi<T = unknown>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  // custom/ 가상 엔드포인트에 대한 처리
  if (endpoint.startsWith('custom/')) {
    return mockCustomData(endpoint, params) as T;
  }

  // scheduler/character-state 호출 시 (N개 캐릭터 콤마 구분 또는 1개 캐릭터)
  if (endpoint === 'scheduler/character-state' && params?.character_names) {
    const namesStr = String(params.character_names).trim();
    if (namesStr.length > 0) {
      const multiResults = await fetchMultiCharacterSchedulerState(
        namesStr,
        params.date ? String(params.date) : undefined
      );
      return {
        multiResults,
        character_names: namesStr,
        date: params.date,
      } as T;
    }
  }

  // 넥슨 공식 API 요청 시 프론트엔드 전용 파라미터(character_names 등) 및 빈 값 정제
  const sanitizedParams: Record<string, string | number> = {};
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      // character_names는 넥슨 API 규격에 없으므로 실제 요청 쿼리스트링에서 제외
      if (key !== 'character_names' && val !== undefined && val !== '') {
        sanitizedParams[key] = val;
      }
    });
  }

  const response = await api.get<T>(endpoint, { params: sanitizedParams });
  return response.data;
}

/**
 * N개 캐릭터 이름(콤마 구분)에 대해 각각 ocid 조회 후 scheduler/character-state를 병렬 호출하는 함수
 */
export async function fetchMultiCharacterSchedulerState(
  characterNamesStr: string,
  date?: string
) {
  const names = characterNamesStr
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (names.length === 0) return [];

  // 1. 각 캐릭터명에 대한 ocid 병렬 조회 (/maplestory/v1/id?character_name=...)
  const ocidResults = await Promise.all(
    names.map(async (name) => {
      try {
        const res = await api.get<{ ocid: string }>('id', {
          params: { character_name: name },
        });
        return { name, ocid: res.data?.ocid ?? null };
      } catch {
        return { name, ocid: null };
      }
    })
  );

  // 2. 각 캐릭터의 ocid로 scheduler/character-state 병렬 호출
  const schedulerResults = await Promise.all(
    ocidResults.map(async ({ name, ocid }) => {
      if (!ocid) {
        return {
          character_name: name,
          error: '캐릭터 OCID를 찾을 수 없습니다.',
          boss_weekly: [],
          boss_contents: [],
        };
      }
      try {
        const queryParams: Record<string, string> = { ocid };
        if (date && date.trim()) {
          queryParams.date = date.trim();
        }
        const res = await api.get<Record<string, unknown>>(
          'scheduler/character-state',
          { params: queryParams }
        );
        return {
          ...res.data,
          character_name: name,
          ocid,
        };
      } catch {
        return {
          character_name: name,
          ocid,
          error: '스케줄러 정보 조회 실패 (본인 계정 캐릭터만 조회 가능)',
          boss_weekly: [],
          boss_contents: [],
        };
      }
    })
  );

  return schedulerResults;
}

function mockCustomData(
  endpoint: string,
  params?: Record<string, string | number | undefined>
) {
  if (endpoint.includes('boss-tracker')) {
    return {
      message: '주간 보스 클리어 트래커 (로컬 관리)',
      ocid: params?.ocid,
      date: params?.date,
      bosses: [
        { name: '하드 루시드', difficulty: 'HARD', rewardMeso: '59,700,000', cleared: false },
        { name: '하드 윌', difficulty: 'HARD', rewardMeso: '73,200,000', cleared: false },
        { name: '카오스 더스크', difficulty: 'CHAOS', rewardMeso: '66,300,000', cleared: false },
        { name: '하드 듄켈', difficulty: 'HARD', rewardMeso: '89,600,000', cleared: false },
        { name: '하드 진 힐라', difficulty: 'HARD', rewardMeso: '100,000,000', cleared: false },
        { name: '검은 마법사', difficulty: 'HARD', rewardMeso: '465,000,000', cleared: false },
      ],
    };
  }
  if (endpoint.includes('quest-tracker')) {
    return {
      message: '일일/주간 숙제 체크리스트',
      ocid: params?.ocid,
      dailyQuests: [
        { name: '아케인리버 일일 퀘스트', completed: true },
        { name: '그란디스 일일 퀘스트', completed: false },
        { name: '익스트림 몬스터파크', completed: false },
        { name: '유니온 일일 코인 수령', completed: true },
      ],
    };
  }
  return {
    message: '시뮬레이션 모듈 준비 중',
    params,
  };
}

export const nexonApi = api;
export default api;
