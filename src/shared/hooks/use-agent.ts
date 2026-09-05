import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';

export function useAgent() {
  return useQuery({
    queryKey: ['agent'],
    queryFn: () => http.get(`/agent`),
    select: (data) => data.data,
  });
}
