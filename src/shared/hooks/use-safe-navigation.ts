import { useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';

/**
 * A safe wrapper around expo-router's useRouter to prevent rapid duplicate navigation calls.
 * @param cooldownMs - The time in milliseconds to wait between navigation calls. Defaults to 500ms.
 */
export function useSafeNavigation(cooldownMs = 500) {
  const router = useRouter();
  const lastNavTime = useRef(0);

  const safeNavigate = useCallback(
    (navFn: (...args: any[]) => void) => {
      return (...args: any[]) => {
        const now = Date.now();
        if (now - lastNavTime.current > cooldownMs) {
          lastNavTime.current = now;
          navFn(...args);
        }
      };
    },
    [cooldownMs]
  );

  return {
    push: safeNavigate(router.push),
    replace: safeNavigate(router.replace),
    back: safeNavigate(router.back),
    setParams: safeNavigate(router.setParams),
  };
}
