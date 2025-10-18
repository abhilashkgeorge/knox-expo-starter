/* eslint-disable max-lines-per-function */
// Import global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Animated, { FadeOut } from 'react-native-reanimated';

import { APIProvider } from '@/api';
import { AlertContainer, AppSplashScreen, AppStatusModal } from '@/components';
import { NotificationProvider } from '@/context';
import { hydrateAuth, loadSelectedTheme } from '@/lib';
import { useAppInitialization as useAppInitializationHook } from '@/lib/hooks/use-app-initialization';
import { initSentry, useSentryNavigationConfig } from '@/lib/sentry';
import { useThemeConfig } from '@/lib/use-theme-config';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

// Initialize auth and theme before app loads
hydrateAuth();
loadSelectedTheme();
initSentry();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  useSentryNavigationConfig();
  const {
    isAppReady,
    requiresForceUpdate,
    updateUrl,
    message,
    modalType,
    retryInitialization,
    dismissStoreUpdate,
  } = useAppInitializationHook();

  // Hide the native splash screen once the app is ready
  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return <AppSplashScreen />;
  }

  return (
    <Providers>
      <Animated.View
        style={{ flex: 1 }}
        exiting={FadeOut.duration(800)}
        onLayout={onLayoutRootView}
      >
        <Stack screenOptions={{ animation: 'flip' }}>
          <Stack.Screen
            name="(app)"
            options={{ title: 'Home', headerShown: false }}
          />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="otp" options={{ headerShown: false }} />
        </Stack>

        {/* Status Modal */}
        {modalType && (
          <AppStatusModal
            visible={!!modalType}
            type={modalType}
            message={
              modalType === 'no-internet'
                ? 'Please check your internet connection and try again.'
                : message
            }
            buttonText={
              modalType === 'no-internet'
                ? 'Retry'
                : modalType === 'ota-update'
                  ? 'Update Now'
                  : 'Go to Store'
            }
            updateUrl={updateUrl || undefined}
            onAction={
              modalType === 'no-internet'
                ? retryInitialization
                : modalType === 'ota-update'
                  ? undefined
                  : modalType === 'store-update' && requiresForceUpdate
                    ? undefined
                    : dismissStoreUpdate
            }
            forceUpdate={modalType === 'store-update' && requiresForceUpdate}
          />
        )}
      </Animated.View>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <NotificationProvider>
      <GestureHandlerRootView
        style={styles.container}
        className={theme.dark ? `dark` : undefined}
      >
        <KeyboardProvider>
          <ThemeProvider value={theme}>
            <APIProvider>
              <AlertContainer />
              <BottomSheetModalProvider>
                {children}
                <FlashMessage position="top" />
              </BottomSheetModalProvider>
            </APIProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Sentry.wrap(RootLayout);
