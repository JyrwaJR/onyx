import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { fetchSessionChildren } from '../../sessions/api/sessions-api';
import { useSubagentStore } from '../store/subagent-store';

/**
 * Replays a session's child (subagent) sessions via the dedicated
 * `GET /session/{sessionID}/children` endpoint into the subagent store, so
 * inline "View session" buttons resolve even after an app restart (when
 * live `session.created` SSE events are no longer available).
 *
 * Idempotent: existing records (status/claims) are never clobbered by
 * `registerChildSession`.
 *
 * @param sessionId - The parent session ID to seed children for.
 */
export function useSubagentChildren(sessionId: string | undefined) {
  const registerChildSession = useSubagentStore((state) => state.registerChildSession);

  const { data: sessions } = useQuery({
    queryKey: queryKeys.sessions.children(sessionId ?? ''),
    queryFn: () => fetchSessionChildren(sessionId ?? ''),
    enabled: !!sessionId,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (!sessionId || !sessions) return;
    for (const session of sessions) {
      if (session.parentID === sessionId) {
        registerChildSession({
          sessionID: session.id,
          parentID: session.parentID,
          agent: session.agent,
          title: session.title,
          projectID: session.projectID,
          directory: session.directory,
          createdAt: session.time.created,
        });
      }
    }
  }, [sessionId, sessions, registerChildSession]);
}
