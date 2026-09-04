/** A streaming assistant message being built from SSE deltas. */
export interface StreamingState {
  text: string;
  reasoning: string;
}
