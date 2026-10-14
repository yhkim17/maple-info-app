import { useState, useMemo } from 'react';
import axios from 'axios';
import type {
  CharacterBasicInfo,
  CharacterStatInfo,
  CharacterItemEquipmentInfo,
  ItemEquipment,
  CharacterSkillInfo,
  CharacterDojangInfo,
  UserUnionInfo,
  CharacterPropensityInfo,
  CharacterAbilityInfo,
  CharacterSymbolInfo,
  CharacterHyperStatInfo,
  HyperStatPreset,
  CharacterLinkSkillInfo,
  GuildBasicInfo,
} from '../types/mapleApi';

interface ApiDataViewerProps {
  endpoint: string;
  data: unknown;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  onRefetch: () => void;
}

export function ApiDataViewer({
  endpoint,
  data,
  isLoading,
  isFetching,
  isError,
  error,
  onRefetch,
}: ApiDataViewerProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [copied, setCopied] = useState(false);

  const handleCopyJson = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 복사 실패 무시
    }
  };

  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className="bg-slate-900/80 rounded-2xl p-12 border border-slate-800 flex flex-col items-center justify-center min-h-[360px] text-center">
        <div className="relative w-14 h-14 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping"></div>
          <div className="w-14 h-14 rounded-full border-4 border-t-amber-400 border-r-transparent border-b-amber-500 border-l-transparent animate-spin"></div>
        </div>
        <h4 className="text-base font-semibold text-white">넥슨 Open API 데이터 호출 중...</h4>
        <p className="text-xs text-slate-400 mt-1 font-mono">GET /{endpoint}</p>
      </div>
    );
  }

  // 에러 상태 렌더링
  if (isError) {
    let errorTitle = 'API 호출 실패';
    let errorMessage = error?.message ?? '데이터를 불러오는 중 오류가 발생했습니다.';
    let isQuotaError = false;

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 429) {
        isQuotaError = true;
        errorTitle = '호출 한도(Quota) 초과 [429 Too Many Requests]';
        errorMessage =
          '넥슨 오픈 API의 초당 호출 제한(초당 5건) 또는 일일 호출 한도(일 1,000건)에 도달했습니다. 잠시 후 다시 시도해 주세요.';
      } else if (status === 400) {
        errorTitle = '잘못된 요청 또는 데이터 없음 [400 Bad Request]';
        errorMessage =
          '해당 일자의 데이터가 아직 갱신되지 않았거나 캐릭터 정보가 존재하지 않습니다.';
      } else if (status === 403) {
        errorTitle = '인증 오류 [403 Forbidden]';
        errorMessage = '넥슨 API 키가 올바르지 않거나 권한이 없습니다. .env를 확인해주세요.';
      }
    }

    return (
      <div className="bg-rose-950/20 border border-rose-800/60 rounded-2xl p-8 text-center min-h-[280px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-2xl mb-3">
          ⚠️
        </div>
        <h4 className="text-base font-bold text-rose-300 mb-1">{errorTitle}</h4>
        <p className="text-xs text-rose-200/80 max-w-md mx-auto leading-relaxed mb-4">
          {errorMessage}
        </p>

        {isQuotaError && (
          <div className="bg-slate-900/80 p-3 rounded-lg border border-rose-900/40 text-xs text-slate-400 max-w-sm mb-4">
            💡 넥슨 개발용 API 키는 1일 1,000회 제한이 적용됩니다.
          </div>
        )}

        <button
          type="button"
          onClick={onRefetch}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 데이터가 아직 없거나 null인 경우
  if (!data) {
    return (
      <div className="bg-slate-900/60 rounded-2xl p-10 border border-slate-800 text-center text-slate-400 text-xs">
        조회된 데이터가 없습니다. 상단 파라미터를 확인 후 조회를 실행해주세요.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
      {/* 뷰어 헤더 바 (탭 및 복사 버튼) */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎨 시각화 뷰 (Visual)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'json'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {'{}'} JSON 원본 (Raw)
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isFetching && (
            <span className="text-[11px] text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              갱신 중
            </span>
          )}
          <button
            type="button"
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <span>{copied ? '✓ 복사됨!' : '📋 JSON 복사'}</span>
          </button>
          <button
            type="button"
            onClick={onRefetch}
            title="데이터 새로고침"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 text-xs transition-colors cursor-pointer"
          >
            🔄
          </button>
        </div>
      </div>

      {/* 뷰어 본문 */}
      <div className="p-5">
        {activeTab === 'visual' ? (
          <VisualApiRenderer endpoint={endpoint} data={data} />
        ) : (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[500px] overflow-auto scrollbar-thin">
            <pre className="font-mono text-xs text-amber-300/90 whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 엔드포인트에 맞는 전용 시각화 렌더러
 */
function VisualApiRenderer({ endpoint, data }: { endpoint: string; data: unknown }) {
  if (endpoint === 'character/basic') {
    return <BasicInfoVisual info={data as CharacterBasicInfo} />;
  }
  if (endpoint === 'character/stat') {
    return <StatInfoVisual info={data as CharacterStatInfo} />;
  }
  if (endpoint === 'character/item-equipment') {
    return <ItemEquipmentVisual info={data as CharacterItemEquipmentInfo} />;
  }
  if (endpoint === 'character/skill') {
    return <SkillVisual info={data as CharacterSkillInfo} />;
  }
  if (endpoint === 'character/dojang') {
    return <DojangVisual info={data as CharacterDojangInfo} />;
  }
  if (endpoint === 'user/union') {
    return <UnionVisual info={data as UserUnionInfo} />;
  }
  if (endpoint === 'character/propensity') {
    return <PropensityVisual info={data as CharacterPropensityInfo} />;
  }
  if (endpoint === 'character/ability') {
    return <AbilityVisual info={data as CharacterAbilityInfo} />;
  }
  if (endpoint === 'character/symbol-equipment') {
    return <SymbolVisual info={data as CharacterSymbolInfo} />;
  }
  if (endpoint === 'character/hyper-stat') {
    return <HyperStatVisual info={data as CharacterHyperStatInfo} />;
  }
  if (endpoint === 'character/link-skill') {
    return <LinkSkillVisual info={data as CharacterLinkSkillInfo} />;
  }
  if (endpoint === 'guild/basic') {
    return <GuildBasicVisual info={data as GuildBasicInfo} />;
  }
  if (endpoint === 'scheduler/character-state' || endpoint === 'custom/boss-tracker') {
    return <SchedulerStateVisual data={data} />;
  }

  // 그 외 일반 API 데이터에 대한 스마트 포맷 뷰어
  return <GenericDataVisual data={data} />;
}

// 1. 캐릭터 기본 정보 뷰
function BasicInfoVisual({ info }: { info: CharacterBasicInfo }) {
  if (!info || !info.character_name) {
    return <GenericDataVisual data={info} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/70 p-6 rounded-2xl border border-slate-800">
        <div className="relative w-28 h-28 bg-slate-900 rounded-2xl flex items-center justify-center border-2 border-amber-500/40 p-2 overflow-hidden shadow-inner shrink-0">
          {info.character_image ? (
            <img
              src={info.character_image}
              alt={info.character_name}
              className="max-h-full object-contain scale-110 drop-shadow-md"
            />
          ) : (
            <span className="text-4xl">🍁</span>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-semibold">
              {info.world_name}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs">
              {info.character_class}
            </span>
            {info.character_guild_name && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs">
                길드: {info.character_guild_name}
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">{info.character_name}</h3>

          <div className="flex items-center justify-center sm:justify-start gap-3 text-sm">
            <span className="font-bold text-amber-400">Lv. {info.character_level}</span>
            <span className="text-slate-400 text-xs">
              경험치: {info.character_exp_rate}% ({info.character_exp?.toLocaleString()} EXP)
            </span>
          </div>

          {/* 경험치 바 */}
          <div className="w-full bg-slate-900 rounded-full h-2 mt-3 overflow-hidden border border-slate-800">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(parseFloat(info.character_exp_rate || '0'), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 부가 메타 정보 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1">성별</span>
          <span className="font-semibold text-slate-200">{info.character_gender ?? '-'}</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1">해방 퀘스트</span>
          <span
            className={`font-semibold ${
              info.liberation_quest_clear_flag === 'true' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            {info.liberation_quest_clear_flag === 'true' ? '완료' : '진행 중 / 미완료'}
          </span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1">캐릭터 생성일</span>
          <span className="font-semibold text-slate-200">
            {info.character_date_create?.split('T')[0] ?? '-'}
          </span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1">데이터 기준일</span>
          <span className="font-semibold text-amber-400/90">{info.date?.split('T')[0] ?? '-'}</span>
        </div>
      </div>
    </div>
  );
}

// 2. 종합 능력치 뷰
function StatInfoVisual({ info }: { info: CharacterStatInfo }) {
  if (!info || !info.final_stat) {
    return <GenericDataVisual data={info} />;
  }

  const statMap: Record<string, string> = {};
  info.final_stat.forEach((item) => {
    statMap[item.stat_name] = item.stat_value;
  });

  const combatPower = statMap['전투력'] ?? '0';
  const statAtkMax = statMap['스탯공격력'] ?? statMap['최대 스탯공격력'] ?? '-';
  const bossDmg = statMap['보스 몬스터 데미지'] ?? '-';
  const ignoreDef = statMap['방어율 무시'] ?? '-';
  const critDmg = statMap['크리티컬 데미지'] ?? '-';
  const critRate = statMap['크리티컬 확률'] ?? '-';
  const str = statMap['STR'] ?? '-';
  const dex = statMap['DEX'] ?? '-';
  const int = statMap['INT'] ?? '-';
  const luk = statMap['LUK'] ?? '-';

  return (
    <div className="space-y-5">
      {/* 전투력 하이라이트 배너 */}
      <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-amber-400 block mb-1">⚔️ 종합 전투력</span>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {parseInt(combatPower, 10).toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block mb-1">직업 계열</span>
          <span className="text-sm font-semibold text-white">{info.character_class}</span>
        </div>
      </div>

      {/* 핵심 주요 스탯 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">스탯 공격력</span>
          <span className="text-sm font-bold text-amber-400">
            {parseInt(statAtkMax, 10) ? parseInt(statAtkMax, 10).toLocaleString() : statAtkMax}
          </span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">보스 몬스터 데미지</span>
          <span className="text-sm font-bold text-rose-400">{bossDmg}%</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">방어율 무시</span>
          <span className="text-sm font-bold text-sky-400">{ignoreDef}%</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">크리티컬 확률</span>
          <span className="text-sm font-bold text-yellow-400">{critRate}%</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-slate-400 block mb-1">크리티컬 데미지</span>
          <span className="text-sm font-bold text-emerald-400">{critDmg}%</span>
        </div>
      </div>

      {/* 기본 4대 스탯 */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-slate-500 block text-[11px]">STR</span>
          <span className="font-semibold text-white">{parseInt(str, 10) ? parseInt(str, 10).toLocaleString() : str}</span>
        </div>
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-slate-500 block text-[11px]">DEX</span>
          <span className="font-semibold text-white">{parseInt(dex, 10) ? parseInt(dex, 10).toLocaleString() : dex}</span>
        </div>
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-slate-500 block text-[11px]">INT</span>
          <span className="font-semibold text-white">{parseInt(int, 10) ? parseInt(int, 10).toLocaleString() : int}</span>
        </div>
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-slate-500 block text-[11px]">LUK</span>
          <span className="font-semibold text-white">{parseInt(luk, 10) ? parseInt(luk, 10).toLocaleString() : luk}</span>
        </div>
      </div>

      {/* 전체 스탯 아코디언/목록 */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <h5 className="text-xs font-semibold text-slate-400 mb-3">전체 세부 스탯 항목 ({info.final_stat.length}개)</h5>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {info.final_stat.map((s) => (
            <div key={s.stat_name} className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 truncate max-w-[120px]">{s.stat_name}</span>
              <span className="font-medium text-slate-200">
                {parseInt(s.stat_value, 10) ? parseInt(s.stat_value, 10).toLocaleString() : s.stat_value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. 장착 장비 뷰
function ItemEquipmentVisual({ info }: { info: CharacterItemEquipmentInfo }) {
  const [selectedItem, setSelectedItem] = useState<ItemEquipment | null>(null);

  if (!info || !info.item_equipment) {
    return <GenericDataVisual data={info} />;
  }

  const gradeColors: Record<string, string> = {
    '레전드리': 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    '유니크': 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    '에픽': 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    '레어': 'text-sky-400 border-sky-500/40 bg-sky-500/10',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>총 {info.item_equipment.length}개 장비 착용 중 (클릭 시 인게임 상세 툴팁 보기)</span>
        <span>직업: {info.character_class}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        {info.item_equipment.map((item, idx) => {
          const potGrade = item.potential_option_grade;
          const potStyle = potGrade ? (gradeColors[potGrade] ?? 'text-slate-300') : null;

          return (
            <div
              key={`${item.item_equipment_part}-${idx}`}
              onClick={() => setSelectedItem(item)}
              className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex gap-3 items-start cursor-pointer hover:border-amber-500/50 hover:bg-slate-900/90 transition-all group relative"
            >
              <div className="w-12 h-12 bg-slate-900 rounded-lg border border-slate-700/80 flex items-center justify-center p-1 shrink-0 group-hover:scale-105 transition-transform">
                {item.item_icon ? (
                  <img src={item.item_icon} alt={item.item_name} className="max-h-full object-contain" />
                ) : (
                  <span>🛡️</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500">{item.item_equipment_part}</span>
                  {parseInt(item.starforce || '0', 10) > 0 && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1 rounded">
                      ★{item.starforce}
                    </span>
                  )}
                  {potGrade && potStyle && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${potStyle}`}>
                      {potGrade}
                    </span>
                  )}
                </div>

                <h5 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-amber-400 transition-colors">
                  {item.item_name}
                </h5>

                {/* 잠재옵션 미리보기 */}
                {item.potential_option_1 && (
                  <p className="text-[10px] text-slate-400 truncate mt-1">
                    옵션: {item.potential_option_1}
                  </p>
                )}
              </div>

              <span className="text-[10px] text-slate-500 group-hover:text-amber-400 self-center">🔍 툴팁</span>
            </div>
          );
        })}
      </div>

      {/* 장비 상세 메이플 인게임 스타일 툴팁 모달 */}
      {selectedItem && (
        <ItemTooltipModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

/**
 * 인게임 메이플스토리 아이템 툴팁 양식 카드 모달
 */
function ItemTooltipModal({ item, onClose }: { item: ItemEquipment; onClose: () => void }) {
  const potGrade = item.potential_option_grade;
  const addPotGrade = item.additional_potential_option_grade;

  const getGradeBadge = (grade: string | null) => {
    if (!grade) return null;
    let letter = 'R';
    let colorClass = 'bg-sky-400 text-slate-950 font-bold';
    if (grade.includes('레전드리')) {
      letter = 'L';
      colorClass = 'bg-emerald-400 text-slate-950 font-bold';
    } else if (grade.includes('유니크')) {
      letter = 'U';
      colorClass = 'bg-amber-400 text-slate-950 font-bold';
    } else if (grade.includes('에픽')) {
      letter = 'E';
      colorClass = 'bg-purple-400 text-white font-bold';
    } else if (grade.includes('레어')) {
      letter = 'R';
      colorClass = 'bg-sky-400 text-slate-950 font-bold';
    }
    return (
      <span className={`w-4 h-4 rounded-xs flex items-center justify-center text-[10px] leading-none ${colorClass}`}>
        {letter}
      </span>
    );
  };

  const totalOptions = item.item_total_option ? Object.entries(item.item_total_option) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl text-slate-100 space-y-3 font-sans animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white text-lg w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* 상단 스타포스 & 명칭 */}
        <div className="text-center space-y-1 pt-1">
          {parseInt(item.starforce || '0', 10) > 0 && (
            <div className="text-xs font-extrabold text-amber-400 font-mono tracking-wider">
              ★ {item.starforce}성
            </div>
          )}
          <h4 className="text-base font-extrabold text-white leading-tight">
            {item.item_name}
          </h4>
          <p className="text-xs text-slate-400 font-medium">
            ({item.potential_option_grade ?? '일반'} 아이템)
          </p>
        </div>

        {/* 점선 구분선 */}
        <div className="border-b border-dashed border-slate-700/80 my-2" />

        {/* 중앙 아이콘 */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-slate-950 rounded-2xl border-2 border-emerald-400/80 p-2 flex items-center justify-center shadow-inner relative">
            {item.item_icon ? (
              <img src={item.item_icon} alt={item.item_name} className="max-h-full object-contain drop-shadow-md" />
            ) : (
              <span className="text-3xl">🛡️</span>
            )}
          </div>
        </div>

        {/* 점선 구분선 */}
        <div className="border-b border-dashed border-slate-700/80 my-2" />

        {/* 장비 분류 및 옵션 상세 항목 */}
        <div className="space-y-1 text-xs text-slate-200 leading-relaxed font-medium">
          <div className="text-slate-300 font-semibold mb-1">
            장비분류 : <span className="text-white">{item.item_equipment_part}</span>
          </div>

          {totalOptions.map(([key, val]) => {
            if (val === undefined || val === null || val === '0' || val === 0) return null;
            return (
              <div key={key} className="flex justify-between py-0.5">
                <span className="text-slate-300">{key} :</span>
                <span className="font-bold text-white">
                  {typeof val === 'number' && val > 0 ? `+${val}` : val}
                </span>
              </div>
            );
          })}

          {/* 가위 사용 가능 횟수 */}
          {item.cuttable_count && item.cuttable_count !== '255' && (
            <div className="text-amber-400 font-bold pt-1">
              가위 사용 가능 횟수 : {item.cuttable_count} 회
            </div>
          )}
        </div>

        {/* 잠재옵션 구역 */}
        {(item.potential_option_1 || item.potential_option_2 || item.potential_option_3) && (
          <>
            <div className="border-b border-dashed border-slate-700/80 my-2" />
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                {getGradeBadge(potGrade)}
                <span>잠재옵션</span>
              </div>
              <div className="space-y-0.5 text-slate-200 text-[11px] pl-1 font-medium">
                {item.potential_option_1 && <div>{item.potential_option_1}</div>}
                {item.potential_option_2 && <div>{item.potential_option_2}</div>}
                {item.potential_option_3 && <div>{item.potential_option_3}</div>}
              </div>
            </div>
          </>
        )}

        {/* 에디셔널 잠재옵션 구역 */}
        {(item.additional_potential_option_1 ||
          item.additional_potential_option_2 ||
          item.additional_potential_option_3) && (
          <>
            <div className="border-b border-dashed border-slate-700/80 my-2" />
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                {getGradeBadge(addPotGrade)}
                <span>에디셔널 잠재옵션</span>
              </div>
              <div className="space-y-0.5 text-slate-200 text-[11px] pl-1 font-medium">
                {item.additional_potential_option_1 && <div>{item.additional_potential_option_1}</div>}
                {item.additional_potential_option_2 && <div>{item.additional_potential_option_2}</div>}
                {item.additional_potential_option_3 && <div>{item.additional_potential_option_3}</div>}
              </div>
            </div>
          </>
        )}

        {/* 소울 옵션 */}
        {item.soul_name && (
          <>
            <div className="border-b border-dashed border-slate-700/80 my-2" />
            <div className="text-xs text-amber-300 space-y-0.5">
              <div className="font-bold">[{item.soul_name}]</div>
              {item.soul_option && <div className="text-[11px] text-slate-300">{item.soul_option}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 4. 스킬 뷰
function SkillVisual({ info }: { info: CharacterSkillInfo }) {
  if (!info || !info.character_skill) {
    return <GenericDataVisual data={info} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>스킬 차수: {info.character_skill_grade}차</span>
        <span>등록된 스킬: {info.character_skill.length}개</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        {info.character_skill.map((skill) => (
          <div
            key={skill.skill_name}
            className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex gap-3 items-start"
          >
            <div className="w-10 h-10 bg-slate-900 rounded-lg border border-slate-700/80 flex items-center justify-center p-1 shrink-0">
              {skill.skill_icon ? (
                <img src={skill.skill_icon} alt={skill.skill_name} className="max-h-full object-contain" />
              ) : (
                <span>⚡</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-white truncate">{skill.skill_name}</h5>
                <span className="text-[11px] font-semibold text-amber-400">Lv. {skill.skill_level}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {skill.skill_description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. 무릉도장 뷰
function DojangVisual({ info }: { info: CharacterDojangInfo }) {
  if (!info || info.dojang_best_floor === undefined) {
    return <GenericDataVisual data={info} />;
  }

  return (
    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl">
        🥋
      </div>
      <div>
        <span className="text-xs text-slate-400">무릉도장 최고 기록</span>
        <div className="text-3xl font-extrabold text-amber-400 mt-1">
          {info.dojang_best_floor}층
        </div>
      </div>
      <div className="flex justify-center gap-6 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
        <div>
          <span className="text-slate-500 block">소요 시간</span>
          <span className="font-semibold">{info.dojang_best_time ? `${Math.floor(info.dojang_best_time / 60)}분 ${info.dojang_best_time % 60}초` : '-'}</span>
        </div>
        <div>
          <span className="text-slate-500 block">기록 일자</span>
          <span className="font-semibold">{info.date_dojang_record?.split('T')[0] ?? '-'}</span>
        </div>
      </div>
    </div>
  );
}

// 6. 유니온 뷰
function UnionVisual({ info }: { info: UserUnionInfo }) {
  if (!info || info.union_level === undefined) {
    return <GenericDataVisual data={info} />;
  }

  return (
    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl">
        🛡️
      </div>
      <div>
        <span className="text-xs text-indigo-400 font-semibold">{info.union_grade ?? '유니온 등급'}</span>
        <div className="text-3xl font-extrabold text-white mt-1">
          Lv. {info.union_level?.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// 7. 일반/공통 스마트 데이터 뷰어
function GenericDataVisual({ data }: { data: unknown }) {
  if (typeof data !== 'object' || data === null) {
    return <div className="text-xs font-mono text-slate-300">{String(data)}</div>;
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-2">
        <span className="text-xs text-slate-400">목록 ({data.length}건)</span>
        <div className="max-h-[450px] overflow-auto space-y-2 pr-1 scrollbar-thin">
          {data.map((item, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-amber-500 font-mono">#{idx + 1}</span>
              <pre className="font-mono text-slate-300 text-[11px] whitespace-pre-wrap mt-1">
                {JSON.stringify(item, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const entries = Object.entries(data as Record<string, unknown>);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
      {entries.map(([key, value]) => {
        const isComplex = typeof value === 'object' && value !== null;
        return (
          <div
            key={key}
            className={`bg-slate-950 p-3.5 rounded-xl border border-slate-800 ${
              isComplex ? 'sm:col-span-2' : ''
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-400 block font-mono mb-1 truncate">
              {key}
            </span>
            {isComplex ? (
              <pre className="font-mono text-[11px] text-amber-300/80 bg-slate-900/60 p-2 rounded-lg overflow-auto max-h-40">
                {JSON.stringify(value, null, 2)}
              </pre>
            ) : (
              <span className="text-xs font-medium text-white break-all">
                {String(value ?? '-')}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 8. 성향 정보 뷰
function PropensityVisual({ info }: { info: CharacterPropensityInfo }) {
  if (!info || info.charisma_level === undefined) {
    return <GenericDataVisual data={info} />;
  }

  const items = [
    { label: '카리스마 (보공/방무)', level: info.charisma_level, icon: '👑', color: 'bg-rose-500' },
    { label: '감성 (버프지속시간)', level: info.sensibility_level, icon: '💧', color: 'bg-sky-500' },
    { label: '통찰력 (속성저하무시)', level: info.insight_level, icon: '👁️', color: 'bg-amber-500' },
    { label: '의지 (최대 HP/방어력)', level: info.willingness_level, icon: '🛡️', color: 'bg-emerald-500' },
    { label: '손재주 (주문서성공률)', level: info.handicraft_level, icon: '✋', color: 'bg-purple-500' },
    { label: '매력 (포켓슬롯개방)', level: info.charm_level, icon: '✨', color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-400 mb-2">성향 레벨 현황 (최대 Lv. 100)</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              <span className="font-mono font-bold text-amber-400">Lv. {item.level}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`${item.color} h-full rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(item.level, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 9. 어빌리티 뷰
function AbilityVisual({ info }: { info: CharacterAbilityInfo }) {
  if (!info || !info.ability_info) {
    return <GenericDataVisual data={info} />;
  }

  const gradeStyles: Record<string, string> = {
    '레전드리': 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    '유니크': 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    '에픽': 'border-purple-500/50 bg-purple-500/10 text-purple-300',
    '레어': 'border-sky-500/50 bg-sky-500/10 text-sky-300',
  };

  const gradeStyle = gradeStyles[info.ability_grade] ?? 'border-slate-700 bg-slate-900 text-slate-300';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div>
          <span className="text-xs text-slate-500 block mb-1">어빌리티 등급</span>
          <span className={`text-base font-bold px-3 py-1 rounded-lg border ${gradeStyle}`}>
            {info.ability_grade ?? '미정'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block mb-1">보유 명성치</span>
          <span className="text-sm font-mono font-bold text-amber-400">
            {info.remain_fame?.toLocaleString() ?? 0} AP
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-slate-400">어빌리티 옵션 줄 (총 {info.ability_info.length}줄)</h5>
        {info.ability_info.map((line, idx) => {
          const lineStyle = gradeStyles[line.ability_grade] ?? 'border-slate-800 bg-slate-950 text-slate-300';
          return (
            <div
              key={idx}
              className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500 font-bold">#{line.ability_no}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${lineStyle}`}>
                  {line.ability_grade}
                </span>
                <span className="font-medium text-slate-100">{line.ability_value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 10. 심볼 장비 뷰
function SymbolVisual({ info }: { info: CharacterSymbolInfo }) {
  if (!info || !info.symbol) {
    return <GenericDataVisual data={info} />;
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-400">장착 심볼 목록 (총 {info.symbol.length}개)</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        {info.symbol.map((sym, idx) => {
          const isMax = sym.symbol_require_growth_count > 0 && sym.symbol_growth_count >= sym.symbol_require_growth_count;
          const rate = sym.symbol_require_growth_count > 0
            ? Math.min(Math.round((sym.symbol_growth_count / sym.symbol_require_growth_count) * 100), 100)
            : 100;

          return (
            <div key={`${sym.symbol_name}-${idx}`} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center p-1 shrink-0">
                  {sym.symbol_icon ? (
                    <img src={sym.symbol_icon} alt={sym.symbol_name} className="max-h-full object-contain" />
                  ) : (
                    <span>🔮</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-white truncate">{sym.symbol_name}</h5>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    Lv. {sym.symbol_level} {isMax && <span className="text-emerald-400 text-[10px]">(MAX)</span>}
                  </span>
                </div>
              </div>

              {/* 스탯 이득 */}
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-300 bg-slate-900/60 p-2 rounded-lg font-mono">
                {sym.symbol_str !== '0' && <span>STR +{sym.symbol_str}</span>}
                {sym.symbol_dex !== '0' && <span>DEX +{sym.symbol_dex}</span>}
                {sym.symbol_int !== '0' && <span>INT +{sym.symbol_int}</span>}
                {sym.symbol_luk !== '0' && <span>LUK +{sym.symbol_luk}</span>}
                {sym.symbol_hp !== '0' && <span>HP +{sym.symbol_hp}</span>}
              </div>

              {/* 성장도 프로그레스 바 */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>성장도</span>
                  <span>
                    {sym.symbol_growth_count} / {sym.symbol_require_growth_count} ({rate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 11. 하이퍼스탯 뷰
function HyperStatVisual({ info }: { info: CharacterHyperStatInfo }) {
  if (!info || !info.hyper_stat_preset_1) {
    return <GenericDataVisual data={info} />;
  }

  const activePresetKey = `hyper_stat_preset_${info.use_preset_no}` as keyof CharacterHyperStatInfo;
  const currentList = (info[activePresetKey] as HyperStatPreset[]) ?? info.hyper_stat_preset_1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400">현재 사용 중인 하이퍼스탯 프리셋</span>
        <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
          프리셋 {info.use_preset_no}번
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin">
        {currentList
          .filter((item) => item.stat_level > 0)
          .map((item) => (
            <div key={item.stat_type} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-slate-200 block">{item.stat_type}</span>
                {item.stat_increase && (
                  <span className="text-[11px] text-emerald-400">{item.stat_increase}</span>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-amber-400 text-sm">Lv. {item.stat_level}</span>
                {item.stat_point !== null && (
                  <span className="text-[10px] text-slate-500 block">({item.stat_point} pt)</span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// 12. 링크 스킬 뷰
function LinkSkillVisual({ info }: { info: CharacterLinkSkillInfo }) {
  if (!info || !info.character_link_skill) {
    return <GenericDataVisual data={info} />;
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-400">전송받아 활성화된 링크 스킬 (총 {info.character_link_skill.length}개)</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
        {info.character_link_skill.map((ls, idx) => (
          <div key={`${ls.skill_name}-${idx}`} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex gap-3 items-start">
            <div className="w-10 h-10 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center p-1 shrink-0">
              {ls.skill_icon ? (
                <img src={ls.skill_icon} alt={ls.skill_name} className="max-h-full object-contain" />
              ) : (
                <span>🔗</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-white truncate">{ls.skill_name}</h5>
                <span className="text-[11px] font-mono font-bold text-sky-400">Lv. {ls.skill_level}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {ls.skill_effect || ls.skill_description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 13. 길드 기본 정보 뷰
function GuildBasicVisual({ info }: { info: GuildBasicInfo }) {
  if (!info || !info.guild_name) {
    return <GenericDataVisual data={info} />;
  }

  return (
    <div className="space-y-5">
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl shrink-0">
            🏰
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                {info.world_name}
              </span>
              <span className="text-xs text-slate-400">길드마스터: {info.guild_master_name}</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{info.guild_name}</h3>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">길드 레벨</span>
            <span className="text-xl font-extrabold text-amber-400 font-mono">Lv. {info.guild_level}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">길드원 수</span>
            <span className="text-xl font-extrabold text-white font-mono">{info.guild_member_count}명</span>
          </div>
        </div>
      </div>

      {/* 길드 노블레스/길드 스킬 목록 */}
      {info.guild_skill && info.guild_skill.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-slate-400">보유 길드 스킬 ({info.guild_skill.length}개)</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {info.guild_skill.map((sk) => (
              <div key={sk.skill_name} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center p-1 shrink-0">
                  {sk.skill_icon ? (
                    <img src={sk.skill_icon} alt={sk.skill_name} className="max-h-full object-contain" />
                  ) : (
                    <span>⭐</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate">{sk.skill_name}</span>
                    <span className="font-mono text-amber-400 font-bold">Lv. {sk.skill_level}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{sk.skill_description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 주간 보스 결정석 추정 메소 가격 계산 헬퍼 함수
function getEstimatedWeeklyBossMeso(name: string, difficulty: string): string {
  const diffUpper = difficulty.toUpperCase();
  const cleanName = name.replace(/(하드|카오스|노멀|이지|익스트림)\s*/g, '').trim();

  const priceMap: Record<string, number> = {
    '자쿰_CHAOS': 9800000,
    '매그너스_HARD': 11500000,
    '힐라_HARD': 6800000,
    '파풀라투스_CHAOS': 26700000,
    '피에르_CHAOS': 9600000,
    '반반_CHAOS': 9600000,
    '블러디퀸_CHAOS': 9600000,
    '벨룸_CHAOS': 12500000,
    '스우_HARD': 70000000,
    '스우_EXTREME': 280000000,
    '데미안_HARD': 73000000,
    '가디언 엔젤 슬라임_CHAOS': 95000000,
    '가디언 엔젤 슬라임_NORMAL': 45000000,
    '루시드_HARD': 108000000,
    '루시드_NORMAL': 50000000,
    '루시드_EASY': 38000000,
    '윌_HARD': 124000000,
    '윌_NORMAL': 58000000,
    '윌_EASY': 42000000,
    '더스크_CHAOS': 135000000,
    '더스크_NORMAL': 62000000,
    '진 힐라_HARD': 175000000,
    '진 힐라_NORMAL': 89000000,
    '듄켈_HARD': 150000000,
    '듄켈_NORMAL': 71000000,
    '선택받은 세렌_HARD': 265000000,
    '선택받은 세렌_NORMAL': 135000000,
    '감시자 칼로스_EASY': 230000000,
    '감시자 칼로스_NORMAL': 350000000,
    '카링_EASY': 280000000,
    '카링_NORMAL': 420000000,
    '최초의 대적자_EASY': 350000000,
    '찬란한 흉성_NORMAL': 180000000,
    '벨로나_EASY': 160000000,
  };

  const key = `${cleanName}_${diffUpper}`;
  if (priceMap[key]) {
    return priceMap[key].toLocaleString();
  }
  return '50,000,000';
}

// 13. 캐릭터 스케줄러 정보 및 다중 캐릭터 주간 보스 트래커 시각화 뷰
function SchedulerStateVisual({ data }: { data: unknown }) {
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');

  const rawData = (data ?? {}) as Record<string, unknown>;
  const dateStr = (rawData.date as string) || new Date().toISOString().split('T')[0];

  // N개 캐릭터 파라미터 파싱
  const defaultCharName = (rawData.character_name as string) || 'ColdZone';
  const rawNamesParam =
    (rawData.character_names as string) ||
    ((rawData.queryParams as Record<string, string>)?.character_names) ||
    ((rawData.params as Record<string, string>)?.character_names) ||
    defaultCharName;

  const charNamesList = useMemo(() => {
    const list = rawNamesParam
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return list.length > 0 ? Array.from(new Set(list)) : [defaultCharName];
  }, [rawNamesParam, defaultCharName]);

  // 기본 주간 보스 목록 템플릿 (폴백용)
  const defaultBossTemplates = useMemo(
    () => [
      { name: '하드 루시드', difficulty: 'HARD', rewardMeso: '108,000,000' },
      { name: '하드 윌', difficulty: 'HARD', rewardMeso: '124,000,000' },
      { name: '카오스 더스크', difficulty: 'CHAOS', rewardMeso: '135,000,000' },
      { name: '하드 듄켈', difficulty: 'HARD', rewardMeso: '150,000,000' },
      { name: '하드 진 힐라', difficulty: 'HARD', rewardMeso: '175,000,000' },
      { name: '검은 마법사', difficulty: 'HARD', rewardMeso: '500,000,000' },
    ],
    []
  );

  // 캐릭터별 보스 클리어 현황 데이터 연산
  const charBossDataList = useMemo(() => {
    const multiResults = (rawData.multiResults as Array<Record<string, unknown>>) || [];

    return charNamesList.map((charName, charIdx) => {
      const charSpecificData =
        multiResults.find(
          (r) => (r.character_name as string)?.toLowerCase() === charName.toLowerCase()
        ) || rawData;

      const rawBossWeekly =
        (charSpecificData.boss_contents as Array<Record<string, unknown>>) ||
        (charSpecificData.boss_weekly as Array<Record<string, unknown>>) ||
        (charSpecificData.bosses as Array<Record<string, unknown>>) ||
        [];

      // 1. weekly_contents/boss_contents 내 bossWeekly 목록만 불러오고, bossMonthly 및 bossDaily는 제외
      // 2. registration_flag가 true인 항목만 필터링
      const registeredWeeklyBosses = rawBossWeekly.filter((b) => {
        const cycle = String(b.cycle || '');
        const isWeekly =
          cycle === 'bossWeekly' || (!cycle && !String(b.content_name || b.name || '').includes('검은 마법사'));
        const isRegistered = String(b.registration_flag) === 'true';
        return isWeekly && isRegistered;
      });

      let bosses: Array<{
        name: string;
        difficulty: string;
        rewardMeso: string;
        cleared: boolean;
      }> = [];

      if (registeredWeeklyBosses.length > 0) {
        // 실제 넥슨 등록 주간 보스 데이터 바인딩
        bosses = registeredWeeklyBosses.map((b) => {
          const name = (b.content_name || b.name || b.boss_name || '') as string;
          const difficulty = String(b.difficulty || 'normal').toUpperCase();
          // 3. complete_flag가 true이면 완료, false이면 미완료
          const isCleared = String(b.complete_flag) === 'true';
          const rewardMeso = getEstimatedWeeklyBossMeso(name, difficulty);

          return {
            name,
            difficulty,
            rewardMeso,
            cleared: isCleared,
          };
        });
      } else {
        // 폴백용 가상 데이터
        bosses = defaultBossTemplates.map((template, bIdx) => {
          let isCleared = false;
          if (charIdx === 0) {
            isCleared = bIdx < 4;
          } else if (charIdx === 1) {
            isCleared = bIdx < 2 || bIdx === 4;
          } else {
            isCleared = (charIdx + bIdx) % 2 === 0;
          }
          return {
            name: template.name,
            difficulty: template.difficulty,
            rewardMeso: template.rewardMeso,
            cleared: isCleared,
          };
        });
      }

      const hasError = Boolean(charSpecificData.error);
      const errorMessage = (charSpecificData.error as string) || undefined;

      const clearedCount = hasError ? 0 : bosses.filter((b) => b.cleared).length;
      const totalMesoNum = hasError
        ? 0
        : bosses
            .filter((b) => b.cleared)
            .reduce((acc, b) => acc + parseInt(b.rewardMeso.replace(/,/g, ''), 10), 0);

      const jobs = ['아크메이지(썬,콜)', '비숍', '나이트로드', '히어로', '바이퍼', '섀도어'];

      return {
        characterName: charName,
        worldName: (charSpecificData.world_name as string) || (rawData.world_name as string) || '베라',
        job: (charSpecificData.character_class as string) || jobs[charIdx % jobs.length],
        level: (charSpecificData.character_level as number) || (280 + ((charIdx * 3) % 15)),
        bosses: hasError ? [] : bosses,
        clearedCount,
        totalBosses: hasError ? 0 : bosses.length,
        totalMesoStr: totalMesoNum.toLocaleString(),
        error: errorMessage,
      };
    });
  }, [charNamesList, defaultBossTemplates, rawData]);

  // 매트릭스 비교 표에서 순회할 주간 보스 목록
  const matrixBossList = useMemo(() => {
    const listMap = new Map<string, { name: string; difficulty: string; rewardMeso: string }>();

    charBossDataList.forEach((c) => {
      c.bosses.forEach((b) => {
        const key = `${b.name}_${b.difficulty}`;
        if (!listMap.has(key)) {
          listMap.set(key, {
            name: b.name,
            difficulty: b.difficulty,
            rewardMeso: b.rewardMeso,
          });
        }
      });
    });

    if (listMap.size === 0) {
      return defaultBossTemplates;
    }
    return Array.from(listMap.values());
  }, [charBossDataList, defaultBossTemplates]);

  // 전체 통계
  const totalCharsCount = charBossDataList.length;
  const totalClearedBosses = charBossDataList.reduce((acc, c) => acc + c.clearedCount, 0);
  const totalPossibleBosses = charBossDataList.reduce((acc, c) => acc + c.totalBosses, 0);
  const grandTotalMesoNum = charBossDataList.reduce((acc, c) => {
    const charSum = c.bosses
      .filter((b) => b.cleared)
      .reduce((bAcc, b) => bAcc + parseInt(b.rewardMeso.replace(/,/g, ''), 10), 0);
    return acc + charSum;
  }, 0);

  return (
    <div className="space-y-6">
      {/* 상단 통합 스탯 대시보드 & 컨트롤 */}
      <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚔️</span>
              <h3 className="text-lg font-bold text-white">
                주간 보스 클리어 현황 대시보드
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-semibold">
                {totalCharsCount}개 캐릭터 조회
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              조회 기준일: <span className="text-slate-200 font-mono">{dateStr}</span> | 캐릭터별 주간 보스 클리어 / 미클리어 상태를 한눈에 파악합니다.
            </p>
          </div>

          {/* 뷰 모드 토글 버튼 */}
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎴</span>
              <span>캐릭터별 카드 뷰</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'matrix'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📊</span>
              <span>한눈에 비교 표</span>
            </button>
          </div>
        </div>

        {/* 요약 메트릭 카운터 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-lg">
              👥
            </div>
            <div>
              <div className="text-[11px] text-slate-400">조회 캐릭터 수</div>
              <div className="text-base font-bold text-white font-mono">
                {totalCharsCount} <span className="text-xs text-slate-400 font-normal">캐릭터</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">
              🎯
            </div>
            <div>
              <div className="text-[11px] text-slate-400">전체 주간 보스 클리어 현황</div>
              <div className="text-base font-bold text-emerald-400 font-mono">
                {totalClearedBosses} / {totalPossibleBosses}개{' '}
                <span className="text-xs text-slate-400 font-normal">
                  ({Math.round((totalClearedBosses / Math.max(totalPossibleBosses, 1)) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
              💰
            </div>
            <div>
              <div className="text-[11px] text-slate-400">예상 결정석 정산액</div>
              <div className="text-base font-bold text-amber-400 font-mono">
                {grandTotalMesoNum.toLocaleString()} <span className="text-xs text-slate-400 font-normal">메소</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* [뷰 모드 1] 캐릭터별 카드 리스트 뷰 */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {charBossDataList.map((char) => {
            const clearPercent = Math.round((char.clearedCount / char.totalBosses) * 100);

            return (
              <div
                key={char.characterName}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-sm"
              >
                {/* 캐릭터 헤더 */}
                <div className="p-4 bg-slate-950/70 border-b border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{char.characterName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {char.worldName}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Lv.{char.level} | {char.job}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {char.clearedCount} / {char.totalBosses} 완료
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                        +{char.totalMesoStr} 메소
                      </div>
                    </div>
                  </div>

                  {/* 클리어 진척도 프로그레스 바 */}
                  <div className="w-full bg-slate-950 rounded-full h-1.5 mt-3 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${clearPercent}%` }}
                    />
                  </div>
                </div>

                {/* 주간 보스 클리어 리스트 또는 오류 메시지 */}
                <div className="p-3 flex-1 space-y-2 overflow-y-auto max-h-[380px]">
                  {char.error ? (
                    <div className="p-4 bg-rose-950/20 border border-rose-800/40 rounded-xl text-center my-3">
                      <div className="text-2xl mb-1.5">⚠️</div>
                      <div className="text-xs font-bold text-rose-300">스케줄러 정보 조회 불가</div>
                      <p className="text-[11px] text-rose-200/80 mt-1 leading-relaxed">
                        {char.error}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2">
                        * 넥슨 정책상 API 키를 발급받은 본인 계정에 속한 캐릭터만 조회가 가능합니다.
                      </p>
                    </div>
                  ) : char.bosses.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      등록된 주간 보스 목록이 없습니다.
                    </div>
                  ) : (
                    char.bosses.map((boss) => (
                      <div
                        key={boss.name}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                          boss.cleared
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-slate-950/60 border-slate-800/80 opacity-80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              boss.cleared ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-rose-500/60'
                            }`}
                          />
                          <div>
                            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                              <span>{boss.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {boss.difficulty}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              보상: {boss.rewardMeso} 메소
                            </div>
                          </div>
                        </div>

                        {/* 클리어 뱃지 */}
                        {boss.cleared ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1">
                            <span>✓</span>
                            <span>완료</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 font-medium text-[11px] flex items-center gap-1">
                            <span>✕</span>
                            <span>미완료</span>
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* [뷰 모드 2] 한눈에 보는 비교 표 (Matrix Table) */}
      {viewMode === 'matrix' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📊 캐릭터별 주간 보스 클리어 현황 한눈에 비교 표</span>
            </h4>
            <div className="text-xs text-slate-400">
              🟢 완료 | 🔴 미완료
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="p-3 min-w-[140px]">주간 보스</th>
                  <th className="p-3">난이도</th>
                  <th className="p-3">결정석 메소</th>
                  {charBossDataList.map((c) => (
                    <th key={c.characterName} className="p-3 text-center min-w-[120px]">
                      <div className="font-bold text-amber-400">{c.characterName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{c.job}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {matrixBossList.map((template) => (
                  <tr key={`${template.name}_${template.difficulty}`} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">{template.name}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {template.difficulty}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">{template.rewardMeso}</td>

                    {charBossDataList.map((c) => {
                      const bossState = c.bosses.find(
                        (b) => b.name === template.name && b.difficulty === template.difficulty
                      );
                      const isCleared = bossState?.cleared ?? false;
                      return (
                        <td key={c.characterName} className="p-3 text-center">
                          {isCleared ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                              <span>✓</span>
                              <span>CLEAR</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px]">
                              <span>✕</span>
                              <span>미완료</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-950 border-t-2 border-slate-800 font-bold text-xs">
                <tr>
                  <td colSpan={3} className="p-3 text-slate-300 text-right">
                    캐릭터별 합계 메소 / 클리어 수:
                  </td>
                  {charBossDataList.map((c) => (
                    <td key={c.characterName} className="p-3 text-center">
                      <div className="text-amber-400">{c.totalMesoStr} 메소</div>
                      <div className="text-[10px] text-emerald-400 font-normal mt-0.5">
                        ({c.clearedCount} / {c.totalBosses}개)
                      </div>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

