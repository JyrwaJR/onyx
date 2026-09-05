import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { McpStatusMap } from '../types/mcp';

export function useMcpStatus() {
  return useQuery({
    queryKey: ['mcp-status'],
    queryFn: () => http.get<McpStatusMap>(`/mcp`),
    select: (data) => Object.values(data.data ?? {}),
  });
}
