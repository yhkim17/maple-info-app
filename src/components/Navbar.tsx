import { MENU_ITEMS, type MenuId } from '../types/navigation';

interface NavbarProps {
  activeMenu: MenuId;
  onSelectMenu: (menuId: MenuId) => void;
  characterName: string;
  onResetCharacter: () => void;
}

export function Navbar({
  activeMenu,
  onSelectMenu,
  characterName,
  onResetCharacter,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* 좌측: 로고 */}
          <div
            onClick={onResetCharacter}
            className="flex items-center gap-2 cursor-pointer group shrink-0 pr-3 border-r border-slate-800/80"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🍁</span>
            <span className="text-base font-bold text-white tracking-tight whitespace-nowrap">
              메이플 인포
            </span>
          </div>

          {/* 중앙: 메뉴 탭 내비게이션 바 (8대 메뉴) */}
          <nav
            className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none py-1 min-w-0"
            aria-label="메인 메뉴"
          >
            {MENU_ITEMS.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectMenu(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex items-center shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`}
                >
                  <span className="mr-1.5 text-sm">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* 우측: 현재 캐릭터 정보 및 캐릭터 변경 */}
          <div className="flex items-center gap-2 shrink-0 pl-3 border-l border-slate-800/80">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80 text-xs">
              <span className="text-slate-400 text-[11px] hidden md:inline">조회 중:</span>
              <span className="font-semibold text-amber-400 truncate max-w-[120px]">{characterName}</span>
            </div>
            <button
              onClick={onResetCharacter}
              type="button"
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              캐릭터 변경
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
