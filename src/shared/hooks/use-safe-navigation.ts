import { useRef } from 'react';
import { useRouter } from 'expo-router';

export function useSafeNavigation(cooldownMs = 500) {
  const router = useRouter();
  const lastNavigationTime = useRef(0);

  const canNavigate = () => {
    const now = Date.now();

    if (now - lastNavigationTime.current < cooldownMs) {
      return false;
    }

    lastNavigationTime.current = now;
    return true;
  };

  const push = (...args: Parameters<typeof router.push>) => {
    if (!canNavigate()) return;

    router.push(...args);
  };

  const replace = (...args: Parameters<typeof router.replace>) => {
    if (!canNavigate()) return;

    router.replace(...args);
  };

  const back = () => {
    if (!canNavigate()) return;

    router.back();
  };

  const setParams = (...args: Parameters<typeof router.setParams>) => {
    if (!canNavigate()) return;

    router.setParams(...args);
  };

  return {
    push,
    replace,
    back,
    setParams,
  };
}
