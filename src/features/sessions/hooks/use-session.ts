import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { fetchSessionById } from '../api/sessions-api';
import type { SessionT } from '../../../shared/api/types';

export function useSession(sessionId: string) {
  return useQuery<SessionT>({
    queryKey: queryKeys.sessions.detail(sessionId),
    queryFn: () => fetchSessionById(sessionId),
    enabled: !!sessionId,
  });
}
