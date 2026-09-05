export type McpConnectionStatus =
  'connected' | 'connecting' | 'disconnected' | 'failed' | 'disabled';

export interface McpStatus {
  /** Server identifier key as configured in opencode.json */
  name: string;

  /** Current connection lifecycle state */
  status: McpConnectionStatus;

  /** Error message if connection failed or encountered an issue */
  error?: string;

  /** Tools registered and provided by this MCP server */
  tools?: Record<string, unknown>;
}

/** Map of server name to its status */
export type McpStatusMap = Record<string, McpStatus>;
