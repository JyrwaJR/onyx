import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { Agent } from '../types/agent';

export function useAgent() {
  return useQuery({
    queryKey: ['agent'],
    queryFn: () => http.get<Agent[]>(`/agent`),
    select: (data) => data.data,
  });
}
