import { useConnectionStore } from '@/shared/stores';
import React, { useEffect } from 'react';
import { ConnectionErrorScreen, Loading } from '../screens';
import { router } from 'expo-router';
import { useHealthCheck } from '@/features/connection';

export const ConnectionProvider = ({ children }: { children: React.ReactNode }) => {
  const { connectionStatus, serverUrl } = useConnectionStore();

  const { isHealthy } = useHealthCheck(connectionStatus === 'connected' ? serverUrl : '');

  useEffect(() => {
    if (connectionStatus === 'connected' && isHealthy) {
      router.replace('/projects' as never);
    }
  }, [connectionStatus, isHealthy]);

  if (connectionStatus === 'connecting') {
    return <Loading />;
  }

  if (connectionStatus === 'error') {
    return <ConnectionErrorScreen />;
  }

  return <>{children}</>;
};
