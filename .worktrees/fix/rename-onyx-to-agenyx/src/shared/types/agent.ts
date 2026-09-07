export interface AgentRequest {
  headers: Record<string, string>;
  body: Record<string, unknown>;
}

export interface AgentPermission {
  action: string;
  resource: string;
  effect: 'allow' | 'deny' | 'ask';
}

export interface Agent {
  id: string;
  request: AgentRequest;
  system: string;
  description: string;
  mode: 'primary' | 'subagent' | 'all';
  hidden: boolean;
  permissions: AgentPermission[];

  /** The prompt/instructions for the agent (from the file body or inline) */
  prompt?: string;

  /** The model identifier (e.g., "anthropic/claude-sonnet-4-6") */
  model?: string;

  /** Specific model variant to use */
  variant?: string;

  /** Tool permissions: either a blanket string ("allow"/"ask"/"deny") or object keyed by tool */
  permission?: string | Record<string, string>;

  /** UI color for the agent */
  color?: string;

  /** Defined steps for the agent to follow */
  steps?: string[];

  /** Additional provider-specific options */
  options?: Record<string, unknown>;

  /** Disables the agent (useful for overriding built-in agents) */
  disable?: boolean;

  /** Model temperature (0.0 to 1.0) */
  temperature?: number;

  /** Model top_p sampling parameter */
  top_p?: number;
}
