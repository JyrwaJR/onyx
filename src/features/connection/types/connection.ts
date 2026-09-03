/**
 * @file Connection feature type definitions.
 */

/** Response shape from the server health check endpoint. */
export interface HealthResponse {
  /** Whether the server is operational. */
  ok: boolean;
  /** Server version string. */
  version: string;
}
