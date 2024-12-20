import { useRouter } from 'expo-router';
import React from 'react';

import { Cover } from '@/components/cover';
import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';
export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center  justify-center">
      <FocusAwareStatusBar />
      <View className="w-full flex-1">
        <Cover />
      </View>
      <View className="justify-end ">
        <Text className="my-3 text-center text-5xl font-bold">
          WifiDabba Starter
        </Text>
        <Text className="mb-2 text-center text-lg text-gray-600">
          This is in collaboration with WeatherXM
        </Text>

        <Text className="my-1 pt-6 text-left text-lg">
          🚀 Inventory Management
        </Text>
        <Text className="my-1 text-left text-lg">
          🥷 Includes setup for WeatherXM devices
        </Text>
        <Text className="my-1 text-left text-lg">
          🧩 Test the setup using REST API.
        </Text>
        <Text className="my-1 text-left text-lg">
          💪 Assisted Deployment and Diagnostics.
        </Text>
      </View>
      <SafeAreaView className="mt-6">
        <Button
          label="Let's Get Started "
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/(app)');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
