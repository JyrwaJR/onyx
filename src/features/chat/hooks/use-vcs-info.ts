import { http } from '@/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { useChatStore } from '../store/chat-store';

export function useVcsInfo() {
  const isStreaming = useChatStore((state) => state.isStreaming);
  return useQuery({
    queryKey: ['vcsInfo'],
    queryFn: () => http.get<{ branch: string; default_branch: string }>('/vcs'),
    select: (data) => data.data,
    // Throttled while streaming: VCS info is not token-dependent and each
    // poll competes with the stream for the JS thread.
    refetchInterval: isStreaming ? 10000 : 60000,
  });
}
