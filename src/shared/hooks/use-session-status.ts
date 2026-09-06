import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { useChatStore } from '@/features/chat';

type SessionStatus = Record<
  string,
  {
    type: 'idle' | 'busy';
  }
>;

export function useSessionStatus({ sessionId }: { sessionId: string }) {
  const { isStreaming } = useChatStore();
  const query = useQuery({
    queryKey: ['session', 'status', sessionId],
    queryFn: () => http.get<SessionStatus>(`/session/status`),
    select: (data) => data.data,
    staleTime: 1000,
    refetchInterval: isStreaming ? 1000 : false,
    refetchIntervalInBackground: false,
  });

  const status = query.data ? query.data[sessionId] : undefined;

  const isBusy = status?.type === 'busy';

  return { ...query, isBusy };
}
