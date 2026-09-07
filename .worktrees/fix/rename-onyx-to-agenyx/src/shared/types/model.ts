export interface Model {
  id: string;
  providerID: string;
  name: string;

  api: {
    id: string;
    type: 'aisdk';
    package: string;
    url: string;
  };

  capabilities: {
    tools: boolean;
    input: ('text' | 'image' | 'video')[];
    output: ('text' | 'image' | 'video')[];
  };

  request: {
    headers: Record<string, string>;
    body: {
      apiKey: string;
    };
  };

  variants: unknown[];

  time: {
    released: number;
  };

  cost: {
    input: number;
    output: number;
    cache: {
      read: number;
      write: number;
    };
  }[];

  status: 'active' | 'deprecated';
  enabled: boolean;

  limit: {
    context: number;
    output: number;
  };
}
