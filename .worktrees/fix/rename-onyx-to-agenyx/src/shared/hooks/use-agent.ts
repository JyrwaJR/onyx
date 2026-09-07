import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { Agent } from '../types/agent';
import { useChatStore } from '@/features/chat';

export function useAgent() {
  const { isStreaming } = useChatStore();
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => http.get<Agent[]>(`/api/agent`),
    select: (data) => data.data,
    refetchInterval: isStreaming ? 3000 : false,
    refetchIntervalInBackground: false,
  });
}
