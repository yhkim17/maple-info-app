import { useState } from 'react';
import { CharacterSearch } from './components/CharacterSearch';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { TabContent } from './components/TabContent';
import { SUB_API_MENUS } from './constants/apiMenus';
import type { MenuId } from './types/navigation';

interface CharacterData {
  name: string;
  ocid: string;
}

function App() {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuId>('character');
  const [activeSubApiId, setActiveSubApiId] = useState<string>(
    SUB_API_MENUS.character[0]?.id ?? 'basic'
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSearchSuccess = (name: string, ocid: string) => {
    setCharacter({ name, ocid });
    setActiveMenu('character');
    setActiveSubApiId(SUB_API_MENUS.character[0]?.id ?? 'basic');
  };

  const handleSelectMenu = (menuId: MenuId) => {
    setActiveMenu(menuId);
    // 상단 메뉴 변경 시 해당 카테고리의 첫 번째 세부 API로 자동 선택
    const firstSubApi = SUB_API_MENUS[menuId]?.[0];
    if (firstSubApi) {
      setActiveSubApiId(firstSubApi.id);
    }
    setIsMobileSidebarOpen(false);
  };

  const handleReset = () => {
    setCharacter(null);
    setIsMobileSidebarOpen(false);
  };

  if (!character) {
    return <CharacterSearch onSearch={handleSearchSuccess} />;
  }

  const currentSubApiList = SUB_API_MENUS[activeMenu] ?? [];
  const currentSubApi =
    currentSubApiList.find((item) => item.id === activeSubApiId) ??
    currentSubApiList[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 상단 네비게이션 헤더 */}
      <Navbar
        activeMenu={activeMenu}
        onSelectMenu={handleSelectMenu}
        characterName={character.name}
        onResetCharacter={handleReset}
      />

      {/* 좌측 사이드바 + 우측 본문 레이아웃 컨테이너 */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        <LeftSidebar
          activeMenu={activeMenu}
          subApiList={currentSubApiList}
          activeSubApiId={activeSubApiId}
          onSelectSubApi={setActiveSubApiId}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <TabContent
          activeMenu={activeMenu}
          activeSubApi={currentSubApi}
          characterName={character.name}
          ocid={character.ocid}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
      </div>
    </div>
  );
}

export default App;
