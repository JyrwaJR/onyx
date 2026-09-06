import { Redirect, useLocalSearchParams } from 'expo-router';
import { useChatStore } from '../../store/chat-store';
import { useEffect } from 'react';

type UseSearchParams = {
  dir?: string;
  sessionId: string;
  projectId: string;
  wrk?: string;
};

const normalize = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectId, sessionId, dir, wrk } = useLocalSearchParams<UseSearchParams>();
  const setContext = useChatStore((state) => state.setContext);
  const clearContext = useChatStore((state) => state.reset);

  useEffect(() => {
    if (!projectId || !sessionId) return;
    setContext({
      projectId,
      activeSessionId: sessionId,
      dir: normalize(dir),
      wrk: normalize(wrk),
    });
    return () => clearContext();
  }, [projectId, sessionId, setContext, dir, wrk, clearContext]);

  if (!sessionId || !projectId) return <Redirect href={'/'} />;

  return <>{children}</>;
};
