import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../shared/api/query-keys';
import { fetchSessions } from '../api/sessions-api';
import type { SessionListResponse } from '../types/session';

export function useSessions(projectId: string, dir: string) {
  return useQuery<SessionListResponse>({
    queryKey: queryKeys.sessions.byProject(projectId),
    queryFn: () => fetchSessions(projectId, dir),
    enabled: !!projectId,
  });
}
