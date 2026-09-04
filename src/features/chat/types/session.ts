export interface SessionContextI {
  data: {
    id: string;
    agent?: string;
    text?: string;
    type: 'user' | 'assistant';

    content?: {
      id: string;
      type: 'reasoning' | 'tool' | 'text';
      text?: string;

      time?: {
        created: number;
        completed?: number;
        ran?: number;
      };

      name?: string;

      provider?: {
        executed: boolean;
      };

      state?: {
        content?: unknown[];
        input?: Record<string, unknown>;
        outputPaths?: string[];
        status?: string;
        structured?: unknown;
      };
    }[];

    cost?: number;
    finish?: string;

    model?: {
      id: string;
      providerID: string;
      variant: string;
    };

    snapshot?: {
      start: string;
      end?: string;
      files?: string[];
    };

    time: {
      created: number;
      completed?: number;
      ran?: number;
    };

    tokens?: {
      cache?: {
        read: number;
        write: number;
      };
      input: number;
      output: number;
      reasoning: number;
    };
  }[];
}
