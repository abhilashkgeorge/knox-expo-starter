/* eslint-disable max-lines-per-function */
import { useCallback, useEffect, useState } from 'react';

import { checkAppVersion } from '@/api';
import { useAppUpdates } from '@/lib/hooks/use-app-updates';
import { useNetworkStatus } from '@/lib/hooks/use-check-internet';

type AppInitializationState = {
  isAppReady: boolean;
  isInitialized: boolean;
  dismissedUpdates: {
    store: boolean;
    // Note: OTA updates should never be dismissible as they're critical
  };
};

export function useAppInitialization() {
  const [state, setState] = useState<AppInitializationState>({
    isAppReady: false,
    isInitialized: false,
    dismissedUpdates: {
      store: false,
    },
  });

  const { isConnected, checkConnection } = useNetworkStatus();

  const {
    hasOTAUpdate,
    hasStoreUpdate,
    requiresForceUpdate,
    updateUrl,
    message,
    checkOTAUpdate,
    checkStoreUpdate,
  } = useAppUpdates();

  const initializeApp = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isAppReady: false }));

      await checkConnection();

      if (isConnected) {
        const versionData = await checkAppVersion();

        await checkOTAUpdate();

        if (versionData) {
          await checkStoreUpdate(versionData);
        }
      }

      setState((prev) => ({
        ...prev,
        isAppReady: true,
        isInitialized: true,
        // Reset dismissal state on re-init (e.g., after network retry)
        dismissedUpdates: { store: false },
      }));
    } catch (error) {
      console.error('App initialization error:', error);
      setState((prev) => ({
        ...prev,
        isAppReady: true,
        isInitialized: true,
      }));
    }
  }, [checkConnection, isConnected, checkOTAUpdate, checkStoreUpdate]);

  useEffect(() => {
    if (!state.isInitialized) {
      initializeApp();
    }
  }, [initializeApp, state.isInitialized]);

  const retryInitialization = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isInitialized: false,
      dismissedUpdates: { store: false },
    }));
  }, []);

  const dismissStoreUpdate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dismissedUpdates: { ...prev.dismissedUpdates, store: true },
    }));
  }, []);

  // Determine which modal should be shown
  let modalType: 'no-internet' | 'ota-update' | 'store-update' | null = null;

  if (state.isInitialized) {
    if (!isConnected) {
      modalType = 'no-internet';
    } else if (hasOTAUpdate) {
      // OTA updates are always shown (never dismissible)
      modalType = 'ota-update';
    } else if (hasStoreUpdate && !state.dismissedUpdates.store) {
      // Store updates can be dismissed if not forced
      modalType = 'store-update';
    }
  }

  return {
    isAppReady: state.isAppReady,
    isConnected,
    hasOTAUpdate,
    hasStoreUpdate,
    requiresForceUpdate,
    updateUrl,
    message,
    modalType,
    retryInitialization,
    dismissStoreUpdate,
  };
}
