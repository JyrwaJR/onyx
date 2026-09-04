import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { SessionT } from '../api';

export function useSession(sessionId: string) {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => http.get<SessionT>(`/session/${sessionId}`),
    select: (data) => data.data,
    enabled: !!sessionId,
  });
}
