export const MENU_ITEMS = [
  { id: 'character', label: '캐릭터 정보 조회', icon: '👤', desc: '캐릭터 기본, 스탯, 장비, 스킬 등의 상세 정보를 조회합니다.' },
  { id: 'union', label: '유니온 정보 조회', icon: '🛡️', desc: '유니온 레벨, 공격대원 배치, 아티팩트 정보를 조회합니다.' },
  { id: 'guild', label: '길드 정보 조회', icon: '🏰', desc: '길드 식별자 및 기본 정보를 조회합니다.' },
  { id: 'training', label: '연무장 정보 조회', icon: '⚔️', desc: '무릉도장 최고 기록 및 전투 분석 시뮬레이션을 제공합니다.' },
  { id: 'probability', label: '확률 정보 조회', icon: '🎲', desc: '잠재능력, 큐브, 스타포스 강화 이력 정보를 조회합니다.' },
  { id: 'scheduler', label: '스케줄러 정보 조회', icon: '📅', desc: '주간 보스, 일일 숙제 및 이벤트 일정을 관리합니다.' },
  { id: 'ranking', label: '랭킹 정보 조회', icon: '🏆', desc: '종합, 유니온, 길드, 무릉도장 랭킹 정보를 조회합니다.' },
  { id: 'notice', label: '공지 정보 조회', icon: '📢', desc: '공지사항, 업데이트, 이벤트, 캐시샵 공지를 조회합니다.' },
] as const;

export type MenuId = typeof MENU_ITEMS[number]['id'];

export interface SubApiMenuItem {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST';
  description: string;
  params: {
    name: string;
    required: boolean;
    description: string;
    example?: string;
  }[];
  tag?: string;
}
