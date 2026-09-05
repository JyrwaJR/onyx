import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { OpencodeCommand } from '../types/command';

export function useCommand() {
  return useQuery({
    queryKey: ['command'],
    queryFn: () => http.get<OpencodeCommand[]>(`/command`),
    select: (data) => data.data,
  });
}
