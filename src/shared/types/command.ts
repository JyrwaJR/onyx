export interface OpencodeCommand {
  /** The command name used to trigger it (e.g., "init") */
  name: string;

  /** A brief description of what the command does */
  description?: string;

  /** The origin or source type of the command (e.g., "command") */
  source?: string;

  /** The prompt template executed when the command is called */
  template: string;

  /** Argument hints or placeholder tags (e.g., ["$ARGUMENTS"]) */
  hints?: string[];

  /** Optional override for the target agent */
  agent?: string;

  /** Optional model override (e.g., "anthropic/claude-sonnet-4-6") */
  model?: string;

  /** Optional model variant */
  variant?: string;

  /** Optional flag indicating whether to run as a subtask */
  subtask?: boolean;
}
