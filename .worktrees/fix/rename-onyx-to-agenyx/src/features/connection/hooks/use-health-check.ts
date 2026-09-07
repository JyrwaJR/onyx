/**
 * @file React Query hook for polling the server health endpoint.
 *
 * Polls GET /health every 5 seconds when a valid server URL is provided
 * and the connection status is "connected".
 */

import { useQuery } from '@tanstack/react-query';

import http from '@utils/http/client';
import { HEALTH_CHECK } from '../../../shared/api/endpoints';
import { HealthResponse } from '@/shared/api';

interface UseHealthCheckResult {
  /** Whether the server is currently healthy. */
  isHealthy: boolean;
  /** Whether a health check request is in flight. */
  isChecking: boolean;
  /** Error message from the last failed health check. */
  error: string | null;
}

/**
 * Polls the server health endpoint at regular intervals.
 *
 * @param serverUrl - The server URL to check. Pass an empty string to disable.
 * @returns Health check status including healthy, checking, and error states.
 */
export function useHealthCheck(serverUrl: string): UseHealthCheckResult {
  const { data, isLoading, error } = useQuery<HealthResponse>({
    queryKey: ['health-check', serverUrl],
    queryFn: async () => {
      const response = await http.get<HealthResponse>(HEALTH_CHECK);
      return response.data;
    },
    enabled: !!serverUrl,
    refetchInterval: 5000,
    retry: false,
    staleTime: 0,
  });

  const isHealthy = data?.healthy === true;

  let errorMessage: string | null = null;
  if (error) {
    const status = (error as { response?: { status?: number } }).response?.status;
    if (status === 401 || status === 403) {
      errorMessage = null;
    } else {
      errorMessage = 'Health check failed.';
    }
  }

  return {
    isHealthy,
    isChecking: isLoading,
    error: errorMessage,
  };
}
