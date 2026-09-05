import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { SessionT } from '../api';

export function useSessionsStatus() {
  return useQuery({
    queryKey: ['session', 'status'],
    queryFn: () => http.get<SessionT>(`/api/session/status`),
    select: (data) => data.data,
  });
}
