import { http } from '@/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { Project } from '../types/project';

export function useCurrentProject() {
  return useQuery({
    queryKey: ['current-project'],
    queryFn: () => http.get<Project>('/api/projects/current'),
    select: (data) => data.data,
  });
}
