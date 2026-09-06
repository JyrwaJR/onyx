import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { Agent } from '../types/agent';
import { useChatStore } from '@/features/chat';

interface AgentAPIResponse {
  location: {
    directory: string;
    project: { id: string; directory: string };
  };
  data: Agent[];
}

export function useAgent() {
  const { isStreaming } = useChatStore();
  return useQuery({
    queryKey: ['agent'],
    queryFn: () => http.get<AgentAPIResponse>(`/agent`),
    select: (data) => data.data?.data,
    refetchInterval: isStreaming ? 3000 : false,
    refetchIntervalInBackground: false,
  });
}
