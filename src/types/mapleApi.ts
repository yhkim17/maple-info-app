/**
 * 메이플스토리 오픈 API 응답 타입 정의
 */

export interface CharacterBasicInfo {
  date: string;
  character_name: string;
  world_name: string;
  character_gender: string;
  character_class: string;
  character_class_level: string;
  character_level: number;
  character_exp: number;
  character_exp_rate: string;
  character_guild_name: string | null;
  character_image: string;
  character_date_create: string;
  access_flag: string;
  liberation_quest_clear_flag: string;
}

export interface CharacterStatItem {
  stat_name: string;
  stat_value: string;
}

export interface CharacterStatInfo {
  date: string;
  character_class: string;
  final_stat: CharacterStatItem[];
  remain_ap: number;
}

export interface ItemEquipment {
  item_equipment_part: string;
  item_equipment_slot: string;
  item_name: string;
  item_icon: string;
  item_description: string | null;
  item_shape_name: string;
  item_shape_icon: string;
  item_gender: string | null;
  item_total_option: Record<string, string | number>;
  item_base_option: Record<string, string | number>;
  item_add_option?: Record<string, string | number>;
  item_etc_option?: Record<string, string | number>;
  item_starforce_option?: Record<string, string | number>;
  potential_option_grade: string | null;
  potential_option_1: string | null;
  potential_option_2: string | null;
  potential_option_3: string | null;
  additional_potential_option_grade: string | null;
  additional_potential_option_1: string | null;
  additional_potential_option_2: string | null;
  additional_potential_option_3: string | null;
  starforce: string;
  starforce_scroll_flag: string;
  cuttable_count?: string | null;
  scroll_upgrade?: string;
  scroll_upgradeable_count?: string;
  soul_name?: string | null;
  soul_option?: string | null;
}

export interface CharacterItemEquipmentInfo {
  date: string;
  character_gender: string;
  character_class: string;
  item_equipment: ItemEquipment[];
}

export interface SkillItem {
  skill_name: string;
  skill_description: string;
  skill_level: number;
  skill_effect: string | null;
  skill_icon: string;
}

export interface CharacterSkillInfo {
  date: string;
  character_class: string;
  character_skill_grade: string;
  character_skill: SkillItem[];
}

export interface CharacterDojangInfo {
  date: string;
  character_class: string;
  world_name: string;
  dojang_best_floor: number;
  date_dojang_record: string;
  dojang_best_time: number;
}

export interface UserUnionInfo {
  date: string;
  union_level: number;
  union_grade: string;
  union_artifact_level?: number;
  union_artifact_exp?: number;
  union_artifact_point?: number;
}

export interface CharacterPropensityInfo {
  date: string;
  charisma_level: number;
  sensibility_level: number;
  insight_level: number;
  willingness_level: number;
  handicraft_level: number;
  charm_level: number;
}

export interface AbilityOption {
  ability_no: string;
  ability_grade: string;
  ability_value: string;
}

export interface CharacterAbilityInfo {
  date: string;
  ability_grade: string;
  ability_info: AbilityOption[];
  remain_fame: number;
}

export interface SymbolItem {
  symbol_name: string;
  symbol_icon: string;
  symbol_description: string;
  symbol_level: number;
  symbol_str: string;
  symbol_dex: string;
  symbol_int: string;
  symbol_luk: string;
  symbol_hp: string;
  symbol_growth_count: number;
  symbol_require_growth_count: number;
}

export interface CharacterSymbolInfo {
  date: string;
  character_class: string;
  symbol: SymbolItem[];
}

export interface HyperStatPreset {
  stat_type: string;
  stat_point: number | null;
  stat_level: number;
  stat_increase: string | null;
}

export interface CharacterHyperStatInfo {
  date: string;
  character_class: string;
  use_preset_no: string;
  hyper_stat_preset_1: HyperStatPreset[];
  hyper_stat_preset_2?: HyperStatPreset[];
  hyper_stat_preset_3?: HyperStatPreset[];
}

export interface LinkSkillItem {
  skill_name: string;
  skill_description: string;
  skill_level: number;
  skill_icon: string;
  skill_effect: string;
}

export interface CharacterLinkSkillInfo {
  date: string;
  character_class: string;
  character_link_skill: LinkSkillItem[];
}

export interface GuildBasicInfo {
  date: string;
  guild_name: string;
  world_name: string;
  guild_level: number;
  guild_fame: number;
  guild_point: number;
  guild_master_name: string;
  guild_member_count: number;
  guild_member: string[];
  guild_skill: Array<{
    skill_name: string;
    skill_description: string;
    skill_level: number;
    skill_icon: string;
  }>;
}

export interface SchedulerContentItem {
  content_name?: string;
  boss_name?: string;
  name?: string;
  difficulty?: string;
  type?: string;
  cycle?: string;
  clear_flag?: boolean | string;
  complete_flag?: string;
  cleared?: boolean;
  clearedOtherDifficulty?: string;
  registration_flag?: string;
  rewardMeso?: string;
  list_order_no?: number;
}

export interface CharacterSchedulerStateInfo {
  date: string;
  character_name: string;
  world_name?: string;
  character_level?: number;
  character_class?: string;
  daily_contents?: SchedulerContentItem[];
  weekly_contents?: SchedulerContentItem[];
  boss_weekly?: SchedulerContentItem[];
  bosses?: SchedulerContentItem[];
}
