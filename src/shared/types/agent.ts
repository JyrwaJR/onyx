export interface Agent {
  /** The prompt/instructions for the agent (from the file body or inline) */
  prompt?: string;

  /** A brief description of what the agent does */
  description?: string;

  /** The execution mode for the agent */
  mode?: 'primary' | 'subagent' | 'all';

  /** The model identifier (e.g., "anthropic/claude-sonnet-4-6") */
  model?: string;

  /** Specific model variant to use */
  variant?: string;

  /** Tool permissions: either a blanket string ("allow"/"ask"/"deny") or object keyed by tool */
  permission?: string | Record<string, string>;

  /** Hides the agent from the default UI/CLI selection */
  hidden?: boolean;

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
