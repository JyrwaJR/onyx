import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { useChatStore } from '@/features/chat';

export function useFindFile(query?: string) {
  const context = useChatStore((state) => state.context);
  return useQuery({
    queryKey: ['find-file', query],
    enabled: !!query,
    queryFn: () =>
      http.get<string[]>(`/find/file`, {
        params: {
          query: query,
          ...(context.dir && { sessionId: context.dir }),
        },
      }),
    select: (data) => data.data,
  });
}
