import { useQuery } from '@tanstack/react-query';
import { fetchNexonApi } from '../api';

export function useNexonApiQuery<T = unknown>(
  endpoint: string,
  params?: Record<string, string | number | undefined>,
  enabled: boolean = true
) {
  return useQuery<T, Error>({
    queryKey: ['nexon-api', endpoint, params],
    queryFn: () => fetchNexonApi<T>(endpoint, params),
    enabled: enabled && !!endpoint,
    staleTime: 1000 * 60 * 3, // 3분간 신선도 유지
  });
}
