import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';

type SessionStatus = Record<
  string,
  {
    type: 'idle' | 'busy';
  }
>;

export function useSessionsStatus({ sessionId }: { sessionId: string }) {
  const query = useQuery({
    queryKey: ['session', 'status'],
    queryFn: () => http.get<SessionStatus>(`/api/session/status`),
    select: (data) => data.data,
    staleTime: 1000,
    refetchInterval: 1000,
    refetchIntervalInBackground: false,
  });

  const status = query.data ? query.data[sessionId] : undefined;

  const isBusy = status?.type === 'busy';

  return { ...query, isBusy };
}
