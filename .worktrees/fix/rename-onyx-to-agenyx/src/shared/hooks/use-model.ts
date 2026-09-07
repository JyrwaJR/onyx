import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { Model } from '../types/model';

/**
 * Hook to fetch available AI models.
 * @returns A query object containing the list of models.
 */
export function useModel() {
  return useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const res = await http.get<Model[]>(`/api/model`);
      return res.data;
    },
  });
}
