/**
 * @file Connection feature type definitions.
 */

/** Response shape from the server health check endpoint (`/global/health`). */
export interface HealthResponse {
  /** Whether the server is operational. */
  healthy: boolean;
  /** Server version string. */
  version?: string;
}
