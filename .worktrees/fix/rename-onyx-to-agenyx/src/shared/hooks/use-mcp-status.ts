import { useQuery } from '@tanstack/react-query';
import { http } from '../utils/http';
import { McpStatusMap } from '../types/mcp';

export function useMcpStatus() {
  const query = useQuery({
    queryKey: ['mcp-status'],
    queryFn: () => http.get<McpStatusMap>('/mcp'),
    select: (response) =>
      Object.entries(response.data ?? {}).map(([name, status]) => ({
        name,
        ...status,
      })),
  });

  const data = query.data ?? [];

  const mapData = Object.fromEntries(data.map((item) => [item.name, item]));

  return {
    ...query,
    data,
    mapData,
  };
}
