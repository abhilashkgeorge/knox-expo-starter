/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { tv } from 'tailwind-variants';

type AlertProps = {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  onDismiss?: () => void;
};

type AlertButton = {
  text: string;
  onPress?: () => void;
  variant?: 'default' | 'brand' | 'outline' | 'ghost' | 'destructive';
};

// Animation duration
const ANIMATION_DURATION = 300;

const alert = tv({
  slots: {
    overlay: 'flex-1 items-center justify-center bg-black/50 px-4',
    container: 'w-full overflow-hidden rounded-xl',
    header: 'px-5 pb-2 pt-5',
    title: 'text-center text-xl font-bold',
    body: 'px-5 py-3',
    message: 'text-center text-base',
    buttonContainer: 'flex flex-row border-t border-neutral-200',
    button: 'flex-1 items-center justify-center py-4',
    buttonText: 'text-base font-semibold',
  },
  variants: {
    variant: {
      default: {
        container: 'bg-white',
        title: 'text-black',
        message: 'text-neutral-700',
      },
      success: {
        container: 'bg-white',
        header: 'border-b-4 border-green-500',
        title: 'text-green-600',
        message: 'text-neutral-700',
      },
      error: {
        container: 'bg-white',
        header: 'border-b-4 border-red-500',
        title: 'text-red-600',
        message: 'text-neutral-700',
      },
      warning: {
        container: 'bg-white',
        header: 'border-b-4 border-amber-500',
        title: 'text-amber-600',
        message: 'text-neutral-700',
      },
      info: {
        container: 'bg-white',
        header: 'border-b-4 border-blue-500',
        title: 'text-blue-600',
        message: 'text-neutral-700',
      },
    },
    buttonVariant: {
      default: {
        button: 'bg-black',
        buttonText: 'text-white',
      },
      brand: {
        button: 'bg-[#ffee02]',
        buttonText: 'font-bold text-black',
      },
      outline: {
        button: 'border border-neutral-300 bg-white',
        buttonText: 'text-black',
      },
      ghost: {
        button: 'bg-transparent',
        buttonText: 'text-black',
      },
      destructive: {
        button: 'bg-red-600',
        buttonText: 'text-white',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    buttonVariant: 'default',
  },
});

export const Alert = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  variant = 'default',
  onDismiss,
}: AlertProps) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible, animation]);

  const styles = alert({ variant });

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const screenHeight = Dimensions.get('window').height;

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={onDismiss}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity }]}
        className={styles.overlay()}
      >
        <Animated.View
          style={{ transform: [{ translateY }], width: '100%', maxWidth: 340 }}
          className={styles.container()}
        >
          <View className={styles.header()}>
            <Text className={styles.title()}>{title}</Text>
          </View>

          <View className={styles.body()}>
            <Text className={styles.message()}>{message}</Text>
          </View>

          <View className={styles.buttonContainer()}>
            {buttons.map((button, index) => {
              const buttonStyles = alert({
                buttonVariant:
                  button.variant ||
                  (index === buttons.length - 1 ? 'brand' : 'ghost'),
              });

              return (
                <Pressable
                  key={index}
                  className={buttonStyles.button({
                    className: index > 0 ? 'border-l border-neutral-200' : '',
                  })}
                  onPress={() => handleButtonPress(button)}
                  android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
                >
                  <Text className={buttonStyles.buttonText()}>
                    {button.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const alertInstanceRef: {
  current: {
    show: (options: Omit<AlertProps, 'visible'>) => void;
    hide: () => void;
  } | null;
} = { current: null };

export const AlertContainer = () => {
  const [config, setConfig] = useState<Omit<AlertProps, 'visible'> | null>(
    null
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    alertInstanceRef.current = {
      show: (options) => {
        setConfig(options);
        setVisible(true);
      },
      hide: () => {
        setVisible(false);
      },
    };

    return () => {
      alertInstanceRef.current = null;
    };
  }, []);

  if (!config) return null;

  return (
    <Alert
      visible={visible}
      title={config.title}
      message={config.message}
      buttons={config.buttons}
      variant={config.variant}
      onDismiss={() => {
        setVisible(false);
        config.onDismiss?.();
      }}
    />
  );
};

export const showAlert = (options: Omit<AlertProps, 'visible'>) => {
  alertInstanceRef.current?.show(options);
};

export const hideAlert = () => {
  alertInstanceRef.current?.hide();
};
