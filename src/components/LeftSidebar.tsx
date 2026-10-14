import { useState } from 'react';
import type { SubApiMenuItem } from '../types/navigation';
import { MENU_ITEMS, type MenuId } from '../types/navigation';

interface LeftSidebarProps {
  activeMenu: MenuId;
  subApiList: SubApiMenuItem[];
  activeSubApiId: string;
  onSelectSubApi: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function LeftSidebar({
  activeMenu,
  subApiList,
  activeSubApiId,
  onSelectSubApi,
  isOpenMobile,
  onCloseMobile,
}: LeftSidebarProps) {
  const [searchFilter, setSearchFilter] = useState('');

  const currentCategory = MENU_ITEMS.find((item) => item.id === activeMenu);

  const filteredList = subApiList.filter((item) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.endpoint.toLowerCase().includes(query) ||
      (item.tag && item.tag.toLowerCase().includes(query))
    );
  });

  return (
    <>
      {/* 모바일 배경 오버레이 */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* 사이드바 본체 */}
      <aside
        className={`fixed lg:sticky top-14 lg:top-14 z-40 lg:z-0 h-[calc(100vh-3.5rem)] w-72 sm:w-80 shrink-0 bg-slate-900/95 lg:bg-slate-900/70 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out backdrop-blur-md ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 상단: 현재 선택된 대메뉴 헤더 및 설명 */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentCategory?.icon}</span>
              <h3 className="font-bold text-white text-base truncate">
                {currentCategory?.label}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {subApiList.length}개 API
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {currentCategory?.desc}
          </p>

          {/* 하위 API 검색 인풋 */}
          <div className="mt-3 relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="API 검색 (명칭, endpoint)"
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 중단: 상세 API 리스트 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              일치하는 API가 없습니다.
            </div>
          ) : (
            filteredList.map((item) => {
              const isActive = activeSubApiId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSubApi(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-sm shadow-amber-500/10'
                      : 'bg-slate-950/30 hover:bg-slate-800/60 border-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isActive ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      {item.name}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.tag && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                          {item.tag}
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.method}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 truncate">
                    /{item.endpoint}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* 하단 정보 */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between">
          <span>NEXON Open API v1</span>
          <span className="text-amber-400/80 font-mono">200 OK</span>
        </div>
      </aside>
    </>
  );
}
