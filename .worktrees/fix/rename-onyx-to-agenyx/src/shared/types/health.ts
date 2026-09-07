export interface HealthResponse {
  /** Whether the server is operational. */
  healthy: boolean;
  /** Server version string. */
  version?: string;
}
