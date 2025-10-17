import { Env } from '@env';
import * as Sentry from '@sentry/react-native';
import { useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

export const initSentry = () => {
  if (!__DEV__) {
    Sentry.init({
      dsn: Env.SENTRY_DSN,

      // Adds more context data to events (IP address, cookies, user, etc.)
      // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
      sendDefaultPii: true,

      // Enable Logs
      enableLogs: true,

      // Configure Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1,
      integrations: [
        Sentry.mobileReplayIntegration(),
        Sentry.feedbackIntegration(),
      ],

      // uncomment the line below to enable Spotlight (https://spotlightjs.com)
      // spotlight: __DEV__,
    });
  }
};

export const useSentryNavigationConfig = () => {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (navigationRef && !__DEV__) {
      navigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [navigationRef]);
};
