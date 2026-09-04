import { http } from '@/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { SessionContextI } from '../types/session';

export function useContext(sessionId: string) {
  return useQuery({
    queryKey: ['session', 'context', sessionId],
    queryFn: () => http.get<SessionContextI>(`/api/session/${sessionId}/context`),
    enabled: !!sessionId,
    select: (data) => data.data,
  });
}
