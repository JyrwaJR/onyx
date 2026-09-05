/**
 * @file Axios request interceptor — attaches access token and device headers.
 *
 * Adds a trace ID, device type, association slug, and Bearer token (if available)
 * to every outgoing request.
 */

import { useConnectionStore } from '@/shared/stores';
import type { InternalAxiosRequestConfig } from 'axios';

/**
 * Creates the request interceptor that attaches the access token and device headers
 * to every outgoing request.
 *
 * @returns The request interceptor function.
 */
export const createRequestInterceptor = () => {
  return async (config: InternalAxiosRequestConfig) => {
    const baseUrl = useConnectionStore.getState().serverUrl || process.env.API_BASE_URL;
    if (baseUrl) {
      config.baseURL = baseUrl;
    }
    return config;
  };
};
