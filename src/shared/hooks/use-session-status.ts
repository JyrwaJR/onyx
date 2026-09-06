import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';

type SessionStatus = Record<
  string,
  {
    type: 'idle' | 'busy';
  }
>;

export function useSessionStatus({
  sessionId,
  isStreaming,
}: {
  sessionId: string;
  isStreaming?: boolean;
}) {
  const query = useQuery({
    queryKey: ['session', 'status', sessionId],
    queryFn: () => http.get<SessionStatus>(`/session/status`),
    select: (data) => data.data,
    staleTime: 1000,
    // Slow while streaming: the SSE deltas already drive the busy state, so
    // a 1s poll would only add main-thread contention during the stream.
    refetchInterval: isStreaming ? 3000 : false,
    refetchIntervalInBackground: false,
  });

  const status = query.data ? query.data[sessionId] : undefined;

  const isBusy = status?.type === 'busy';

  return { ...query, isBusy };
}
