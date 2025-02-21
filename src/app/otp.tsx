/* eslint-disable max-lines-per-function */
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { z } from 'zod';

import { useVerifyOtp } from '@/api/login/verify-otp';
import {
  Button,
  FocusAwareStatusBar,
  Image,
  showErrorMessage,
  showSuccessMessage,
  Text,
  View,
} from '@/components/ui';
import { useRequiredParams } from '@/lib';

const otpSchema = z
  .string()
  .length(4, 'OTP must be exactly 4 digits.')
  .regex(/^\d+$/, 'OTP must only contain numbers.');

export default function Otp() {
  const [otp, setOtp] = useState('');
  const { mutate: verifyOtp, isPending } = useVerifyOtp();

  const { phone } = useRequiredParams<{ phone: string }>();

  const handleVerifyOtp = () => {
    const validation = otpSchema.safeParse(otp);
    if (!validation.success) {
      showErrorMessage(validation.error.errors[0].message);
      return;
    }
    verifyOtp(
      {
        phone: phone,
        otp: otp,
      },
      {
        onSuccess: () => {
          showSuccessMessage('OTP Verified');
          router.replace('/');
        },
        onError: (error) => {
          showErrorMessage(`OTP Verification Failed: ${error.message}`);
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <FocusAwareStatusBar />
      <View className=" flex-1 pt-20">
        <Image
          source={require('@/../assets/icon.png')}
          className="w-ful m-10 h-1/6 overflow-hidden"
          contentFit="contain"
        />
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-2 text-center text-3xl font-bold"
          >
            Enter Verification Code
          </Text>

          <Text className="mb-6 max-w-xs text-center text-gray-500">
            We are automatically detecting the OTP sent to your number ******
          </Text>
        </View>
        <View className="px-16 py-6">
          <OtpInput
            numberOfDigits={4}
            focusColor="green"
            type="numeric"
            onFilled={(code) => setOtp(code)}
            theme={{
              pinCodeTextStyle: {
                color: 'white',
              },
            }}
          />
          <View className="mt-4 flex-row justify-center">
            <Text className="text-gray-500">Don't receive the OTP? </Text>
            <Text
              className="text-blue-500"
              onPress={() => {}}
              testID="resend-otp"
            >
              RESEND OTP
            </Text>
          </View>
          <Button
            testID="verify-otp-button"
            className="mt-10 h-12 w-1/2 self-center"
            label="Verify OTP"
            variant="default"
            onPress={() => handleVerifyOtp()}
            loading={isPending}
            disabled={isPending}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
