import { useState } from 'react';
import { getCharacterOcid } from '../api/character';

interface CharacterSearchProps {
  onSearch: (name: string, ocid: string) => void;
}

export function CharacterSearch({ onSearch }: CharacterSearchProps) {
  const [characterName, setCharacterName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateAndSearch = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert('캐릭터명을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const ocid = await getCharacterOcid(trimmed);

      if (ocid) {
        // 실제 존재하는 캐릭터인 경우
        onSearch(trimmed, ocid);
      } else {
        // 존재하지 않거나 유효하지 않은 캐릭터명인 경우
        alert('유효한 캐릭터명을 입력해주세요.');
      }
    } catch {
      alert('캐릭터 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    validateAndSearch(characterName);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
        {/* 헤더 타이틀 */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-amber-500/10 rounded-full mb-3 text-3xl">
            🍁
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            메이플 캐릭터 검색
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            조회할 메이플스토리 캐릭터명을 입력해주세요.
          </p>
        </div>

        {/* 검색 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="character-name-input"
              className="block text-sm font-medium text-slate-300 mb-1.5"
            >
              캐릭터명
            </label>
            <div className="relative">
              <input
                id="character-name-input"
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="예: 타락파워전사"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-slate-950"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>캐릭터 확인 중...</span>
              </>
            ) : (
              '확인'
            )}
          </button>
        </form>

        {/* 추천/예시 검색어 */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400 mb-2">실제 존재하는 예시 닉네임으로 테스트</p>
          <div className="flex justify-center gap-2">
            {['ColdZone', '롤핵고수', '없카', '꾹꾹코스터', '카스테라망고'].map((sample) => (
              <button
                key={sample}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setCharacterName(sample);
                  validateAndSearch(sample);
                }}
                className="text-xs px-2.5 py-1 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
