export interface Model {
  /** The model identifier (e.g., "anthropic/claude-sonnet-4-6") */
  id: string;

  /** Display name of the model */
  name: string;

  /** The provider identifier (e.g., "anthropic") */
  provider: string;

  /** Model description */
  description?: string;

  /** Indicates if the model is currently active/available */
  active?: boolean;
}
