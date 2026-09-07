import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../utils/http';

export function useToggleMcp() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: ({ status, name }: { status: string; name: string }) =>
      http.post(status === 'connected' ? `/mcp/${name}/disconnect` : `/mcp/${name}/connect`),
    onSuccess: () => query.invalidateQueries({ queryKey: ['mcp-status'] }),
  });
}
