import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { View } from '@/components/ui';

export const SplashScreen = ({
  onAnimationFinish,
}: {
  onAnimationFinish: () => void;
}) => {
  const animationRef = useRef<LottieView>(null);
  const repeatCount = useSharedValue(0);

  useEffect(() => {
    // Start the animation after the component mounts
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  useEffect(() => {
    // Logic to control the animation repetition
    const interval = setInterval(() => {
      repeatCount.value += 1;

      if (repeatCount.value >= 3) {
        clearInterval(interval);
        onAnimationFinish(); // Trigger navigation after 3 repetitions
      }
    }, 1500); // Adjust this duration based on your animation length

    return () => clearInterval(interval);
  }, [repeatCount]);

  return (
    <View className="align-center background-white flex-1 justify-center">
      <LottieView
        ref={animationRef}
        source={require('../../assets/spinning.json')}
        autoPlay
        loop={false}
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
};
