import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { SessionT } from '../api';
import { useChatStore } from '@/features/chat';

export function useSession() {
  const sessionId = useChatStore((val) => val.context.activeSessionId);
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => http.get<SessionT>(`/api/session/${sessionId}`),
    select: (data) => data.data,
    enabled: !!sessionId,
  });
}
