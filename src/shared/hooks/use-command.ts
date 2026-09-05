import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';

export function useCommand() {
  return useQuery({
    queryKey: ['command'],
    queryFn: () => http.get(`/command`),
    select: (data) => data.data,
  });
}
