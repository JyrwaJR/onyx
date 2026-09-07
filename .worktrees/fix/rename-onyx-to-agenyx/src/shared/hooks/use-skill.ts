import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { OpencodeSkill } from '../types/skill';

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => http.get<OpencodeSkill[]>(`/skill`),
    select: (data) => data.data,
  });
}
