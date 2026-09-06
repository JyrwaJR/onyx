import { http } from '@/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { useChatStore } from '../store/chat-store';

export function useVcsInfo() {
  const { isStreaming } = useChatStore();
  return useQuery({
    queryKey: ['vcsInfo'],
    queryFn: () => http.get<{ branch: string; default_branch: string }>('/vcs'),
    select: (data) => data.data,
    refetchInterval: isStreaming ? 1000 : 60000,
  });
}
