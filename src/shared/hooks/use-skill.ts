import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => http.get(`/skill`),
    select: (data) => data.data,
  });
}
