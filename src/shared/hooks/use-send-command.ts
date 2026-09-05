import { useMutation } from '@tanstack/react-query';
import { http } from '../utils/http';

type Command = {
  command: string;
  sessionId: string;
  agent: string;
  args?: string;
};
export function useSendCommand() {
  return useMutation({
    mutationFn: ({ sessionId, command, agent, args }: Command) =>
      http.post(`/session/${sessionId}/command`, { command, agent, arguments: args }),
  });
}
