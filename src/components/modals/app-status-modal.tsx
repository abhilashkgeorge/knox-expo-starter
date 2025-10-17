/* eslint-disable max-lines-per-function */
import * as Updates from 'expo-updates';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
} from 'react-native-reanimated';

import { Button, showErrorMessage, Text, View } from '@/components/ui';

export type StatusType = 'no-internet' | 'ota-update' | 'store-update';

type AppStatusModalProps = {
  visible: boolean;
  type: StatusType;
  message: string;
  buttonText: string;
  updateUrl?: string;
  onAction?: () => void;
  forceUpdate?: boolean;
};

export function AppStatusModal({
  visible,
  type,
  message,
  buttonText,
  updateUrl,
  onAction,
  forceUpdate = false,
}: AppStatusModalProps) {
  const lottieRef = useRef<LottieView>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');

  useEffect(() => {
    if (visible && lottieRef.current) {
      lottieRef.current.play();
    }
  }, [visible]);

  if (!visible) return null;

  const handleAction = async () => {
    switch (type) {
      case 'no-internet':
        if (onAction) onAction();
        break;

      case 'ota-update':
        setIsUpdating(true);
        setUpdateStatus('Downloading and installing update...');

        try {
          await Updates.fetchUpdateAsync();
          setUpdateStatus('Restarting app...');

          // Small delay to show the final status
          setTimeout(async () => {
            await Updates.reloadAsync();
          }, 1500);
        } catch (error) {
          showErrorMessage(
            `Failed to fetch update. Please try again later.${error}`
          );
          setIsUpdating(false);
          setUpdateStatus('Update failed. Please try again.');
          // Reset after showing error
          setTimeout(() => {
            setUpdateStatus('');
          }, 3000);
        }
        break;

      case 'store-update':
        if (updateUrl) {
          await Linking.openURL(updateUrl);
        }
        if (!forceUpdate && onAction) {
          onAction();
        }
        break;

      default:
        if (onAction) onAction();
    }
  };

  const handleLater = () => {
    if (type === 'store-update' && !forceUpdate && onAction) {
      onAction();
    }
  };

  const animationSource =
    type === 'no-internet'
      ? require('@/../assets/lottie/spinning.json')
      : type === 'ota-update'
        ? require('@/../assets/lottie/logo_lottie.json')
        : require('@/../assets/lottie/logo_lottie.json');

  const title =
    type === 'no-internet'
      ? 'No Internet Connection'
      : type === 'ota-update'
        ? isUpdating
          ? 'Updating App'
          : 'Update Available'
        : 'New Version Available';

  const displayMessage = isUpdating && updateStatus ? updateStatus : message;

  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.backdrop}>
      <Animated.View
        entering={SlideInDown.springify().damping(15)}
        style={styles.modalContainer}
      >
        <View
          style={styles.modalContent}
          className="bg-white dark:bg-neutral-800"
        >
          <Animated.View entering={FadeIn.duration(1000)}>
            <LottieView
              ref={lottieRef}
              source={animationSource}
              autoPlay
              loop
              style={styles.animation}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(800)}>
            <Text className="text-center text-2xl font-bold text-neutral-800 dark:text-white">
              {title}
            </Text>

            <Text className="mt-3 text-center text-base text-neutral-600 dark:text-neutral-400">
              {displayMessage}
            </Text>

            {type === 'ota-update' && isUpdating && (
              <View className="mt-4 flex-row items-center justify-center">
                <View className="mr-2 size-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <Text className="text-sm text-neutral-600 dark:text-neutral-400">
                  Please wait...
                </Text>
              </View>
            )}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600).duration(800)}
            className="mt-6 w-full"
          >
            {type === 'ota-update' && isUpdating ? (
              <View className="items-center">
                <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                  Please don&apos;t close the app
                </Text>
              </View>
            ) : (
              <View className="w-full space-y-3">
                <Button
                  variant="brand"
                  size="sm"
                  label={buttonText}
                  onPress={handleAction}
                  className="h-12 w-full"
                  disabled={isUpdating}
                />

                {type === 'store-update' && !forceUpdate && (
                  <Button
                    variant="outline"
                    size="sm"
                    label="Later"
                    onPress={handleLater}
                    className="h-12 w-full"
                  />
                )}
              </View>
            )}
          </Animated.View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '85%',
    maxWidth: 340,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    padding: 24,
    alignItems: 'center',
  },
  animation: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
});
