import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { McpStatus } from '../types/mcp';

export function useMcpStatus() {
  return useQuery({
    queryKey: ['mcp-status'],
    queryFn: () => http.get<McpStatus[]>(`/mcp`),
    select: (data) => data.data,
  });
}
