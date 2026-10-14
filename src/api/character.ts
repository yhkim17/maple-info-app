import { api } from './index';

export interface CharacterIdResponse {
  ocid: string;
}

/**
 * 캐릭터명을 기반으로 메이플스토리 식별자(ocid)를 조회합니다.
 * @param characterName 캐릭터 닉네임
 * @returns 존재하는 캐릭터인 경우 ocid 반환, 존재하지 않거나 오류 시 null 반환
 */
export async function getCharacterOcid(characterName: string): Promise<string | null> {
  try {
    const response = await api.get<CharacterIdResponse>('id', {
      params: {
        character_name: characterName,
      },
    });

    return response.data?.ocid ?? null;
  } catch {
    // 400 Bad Request 등 존재하지 않는 캐릭터이거나 API 에러 발생 시 null 반환
    return null;
  }
}
