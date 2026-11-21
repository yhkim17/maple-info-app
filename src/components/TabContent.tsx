import { useState, useMemo } from 'react';
import type { MenuId, SubApiMenuItem } from '../types/navigation';
import { MENU_ITEMS } from '../types/navigation';
import { useNexonApiQuery } from '../hooks/useNexonApiQuery';
import { ApiDataViewer } from './ApiDataViewer';

interface TabContentProps {
  activeMenu: MenuId;
  activeSubApi?: SubApiMenuItem;
  characterName: string;
  ocid: string;
  onOpenMobileSidebar: () => void;
}

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function TabContent({
  activeMenu,
  activeSubApi,
  characterName,
  ocid,
  onOpenMobileSidebar,
}: TabContentProps) {
  const currentMenu = MENU_ITEMS.find((item) => item.id === activeMenu);

  // 파라미터 상태 관리
  const [selectedDate, setSelectedDate] = useState('');
  const [skillGrade, setSkillGrade] = useState('6');
  const [guildName, setGuildName] = useState('메이플');
  const [worldName, setWorldName] = useState('스카니아');
  const [multiCharNamesInput, setMultiCharNamesInput] = useState(
    characterName ? `${characterName}, BishopZone, ChIlliumZone, ChBeMeZone` : 'ColdZone, BishopZone'
  );
  const [appliedMultiCharNames, setAppliedMultiCharNames] = useState(
    characterName ? `${characterName}, BishopZone, ChIlliumZone, ChBeMeZone` : 'ColdZone, BishopZone'
  );

  // 현재 엔드포인트에 맞는 파라미터 객체 동적 빌드
  const queryParams = useMemo(() => {
    if (!activeSubApi) return undefined;
    const params: Record<string, string | number | undefined> = {};

    activeSubApi.params.forEach((p) => {
      if (p.name === 'ocid') {
        params.ocid = ocid;
      } else if (p.name === 'character_name') {
        params.character_name = characterName;
      } else if (p.name === 'date') {
        if (selectedDate.trim()) {
          params.date = selectedDate.trim();
        } else if (activeSubApi.endpoint.startsWith('history/')) {
          params.date = getTodayString();
        }
      } else if (p.name === 'character_skill_grade') {
        params.character_skill_grade = skillGrade;
      } else if (p.name === 'guild_name') {
        params.guild_name = guildName;
      } else if (p.name === 'world_name') {
        params.world_name = worldName;
      } else if (p.name === 'count') {
        params.count = 100;
      } else if (p.name === 'difficulty') {
        params.difficulty = 1;
      } else if (p.name === 'ranking_type') {
        params.ranking_type = 0;
      }
    });

    // 오직 scheduler/character-state 호출 시에만 N개의 다중 캐릭터 파라미터 전달 (적용된 상태만 전달)
    if (activeSubApi.endpoint === 'scheduler/character-state') {
      params.character_names = appliedMultiCharNames.trim() || characterName;
    }

    return Object.keys(params).length > 0 ? params : undefined;
  }, [activeSubApi, ocid, characterName, selectedDate, skillGrade, guildName, worldName, appliedMultiCharNames]);

  // 필수 파라미터 충족 여부 확인
  const isEnabled = useMemo(() => {
    if (!activeSubApi) return false;
    const hasRequiredMissing = activeSubApi.params.some((p) => {
      if (!p.required) return false;
      const val = queryParams?.[p.name];
      return val === undefined || val === '';
    });
    return !hasRequiredMissing;
  }, [activeSubApi, queryParams]);

  // React Query 호출
  const { data, isLoading, isFetching, isError, error, refetch } = useNexonApiQuery(
    activeSubApi?.endpoint ?? '',
    queryParams,
    isEnabled
  );

  // queryParams를 data 객체와 병합하여 ApiDataViewer로 전달
  const enrichedData = useMemo(() => {
    if (!data || typeof data !== 'object') return data;
    return {
      ...(data as object),
      queryParams,
      character_names: queryParams?.character_names,
    };
  }, [data, queryParams]);

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full min-w-0">
      {/* 모바일용 좌측 API 목록 토글 버튼 */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-750 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>📋</span>
            <span>상세 API 목록 열기 ({currentMenu?.label})</span>
          </span>
          <span className="text-amber-400 text-xs">선택: {activeSubApi?.name} →</span>
        </button>
      </div>

      {/* 헤더 섹션 & 상단 우측 API 컨트롤러 */}
      <div className="mb-6 pb-5 border-b border-slate-800 flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        {/* 좌측: 타이틀 및 안내 */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
            <span>
              {currentMenu?.icon} {currentMenu?.label}
            </span>
            <span>/</span>
            <span className="text-amber-400 font-medium">{activeSubApi?.name}</span>
            {activeSubApi?.tag && (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                {activeSubApi.tag}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span>{activeSubApi?.name ?? currentMenu?.label}</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {activeSubApi?.method ?? 'GET'}
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-xl">
            {activeSubApi?.description ?? currentMenu?.desc}
          </p>
        </div>

        {/* 우측 상단: 엔드포인트 URL & 파라미터 컨트롤 */}
        <div className="flex flex-col items-start xl:items-end gap-2 shrink-0 w-full xl:w-auto">
          {/* 엔드포인트 URL 바 */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs w-full xl:w-auto justify-between xl:justify-end shadow-xs">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-emerald-400 font-bold">{activeSubApi?.method ?? 'GET'}</span>
              <span className="text-slate-500">/maplestory/v1/</span>
              <span className="text-amber-400 font-semibold">{activeSubApi?.endpoint}</span>
            </div>
            <span className="shrink-0 text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 ml-1">
              x-nxopen-api-key 연동
            </span>
          </div>

          {/* 파라미터 조절 및 새로고침 버튼 */}
          <div className="flex flex-wrap items-center gap-2 text-xs w-full xl:w-auto justify-start xl:justify-end">
            {/* 스케줄러 정보 조회 시 다중 캐릭터 입력 필드 (scheduler/character-state 전용) */}
            {activeSubApi?.endpoint === 'scheduler/character-state' && (
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex-1 sm:flex-initial min-w-[280px]">
                <span className="text-amber-400 font-semibold text-[11px] whitespace-nowrap">
                  👥 다중 캐릭터:
                </span>
                <input
                  type="text"
                  value={multiCharNamesInput}
                  onChange={(e) => setMultiCharNamesInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setAppliedMultiCharNames(multiCharNamesInput.trim() || characterName);
                    }
                  }}
                  placeholder="예: ColdZone, BishopZone"
                  className="bg-transparent text-slate-100 text-xs w-full focus:outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={() => setAppliedMultiCharNames(multiCharNamesInput.trim() || characterName)}
                  className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold rounded text-[10px] whitespace-nowrap transition-colors cursor-pointer border border-amber-500/30"
                >
                  적용
                </button>
              </div>
            )}

            {/* date 파라미터가 있을 때 */}
            {activeSubApi?.params.some((p) => p.name === 'date') && (
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">기준일(date):</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="bg-transparent text-slate-200 text-xs focus:outline-hidden"
                />
                {!selectedDate ? (
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono whitespace-nowrap">
                    {activeSubApi?.endpoint.startsWith('history/') ? '오늘 디폴트 적용' : '최신 데이터 자동 조회'}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedDate('')}
                    className="text-slate-500 hover:text-slate-300 text-[10px] cursor-pointer"
                  >
                    초기화
                  </button>
                )}
              </div>
            )}

            {/* 스킬 차수 선택 (character/skill인 경우) */}
            {activeSubApi?.endpoint === 'character/skill' && (
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">스킬 차수:</span>
                <select
                  value={skillGrade}
                  onChange={(e) => setSkillGrade(e.target.value)}
                  className="bg-slate-900 text-amber-400 font-semibold text-xs rounded px-2 py-0.5 border border-slate-700 focus:outline-hidden"
                >
                  <option value="0">0차 스킬</option>
                  <option value="1">1차 스킬</option>
                  <option value="2">2차 스킬</option>
                  <option value="3">3차 스킬</option>
                  <option value="4">4차 스킬</option>
                  <option value="5">5차 (V매트릭스)</option>
                  <option value="6">6차 (HEXA)</option>
                </select>
              </div>
            )}

            {/* 길드 파라미터 */}
            {activeSubApi?.endpoint === 'guild/id' && (
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] whitespace-nowrap">길드명:</span>
                  <input
                    type="text"
                    value={guildName}
                    onChange={(e) => setGuildName(e.target.value)}
                    className="bg-transparent text-slate-200 text-xs w-20 focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] whitespace-nowrap">월드명:</span>
                  <input
                    type="text"
                    value={worldName}
                    onChange={(e) => setWorldName(e.target.value)}
                    className="bg-transparent text-slate-200 text-xs w-20 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* 수동 재호출 버튼 */}
            <button
              type="button"
              onClick={() => {
                if (activeSubApi?.endpoint === 'scheduler/character-state') {
                  setAppliedMultiCharNames(multiCharNamesInput.trim() || characterName);
                }
                refetch();
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
            >
              <span>🚀</span>
              <span>API 호출 / 새로고침</span>
            </button>
          </div>
        </div>
      </div>

      {/* API 데이터 뷰어 (시각화 + Raw JSON) */}
      <ApiDataViewer
        endpoint={activeSubApi?.endpoint ?? ''}
        data={enrichedData}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        onRefetch={() => refetch()}
      />
    </main>
  );
}
