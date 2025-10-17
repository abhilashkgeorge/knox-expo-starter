import LottieView from 'lottie-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Text } from '@/components/ui';

type AppSplashScreenProps = {
  message?: string;
};

export function AppSplashScreen({
  message = 'Loading your connection...',
}: AppSplashScreenProps) {
  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <LottieView
        source={require('@/../assets/lottie/logo_lottie.json')}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />
      <Text className="text-brand-500 mt-6 text-2xl font-bold">Dabba</Text>
      <Text className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {message}
      </Text>
      <ActivityIndicator style={styles.loader} color="#ffee02" size="small" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  loader: {
    marginTop: 20,
  },
});
