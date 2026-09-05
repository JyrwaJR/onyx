import { create } from 'axios';
import { getApiBaseUrl } from './constants';
import { createRequestInterceptor } from './request-interceptor';
import { createResponseInterceptor } from './response-interceptor';

/**
 * Configured Axios instance for application-wide API requests.
 * The baseURL is set dynamically via a request interceptor that reads
 * the current value from getApiBaseUrl() on every request.
 */
const apiClient = create({
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject dynamic base URL on every request
apiClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

apiClient.interceptors.request.use(createRequestInterceptor());
apiClient.interceptors.response.use(...createResponseInterceptor(apiClient));

export default apiClient;
