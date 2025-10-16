/* eslint-disable max-lines-per-function */
import { zodResolver } from '@hookform/resolvers/zod';
import LottieView from 'lottie-react-native';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import {
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native-keyboard-controller';
import { OtpInput } from 'react-native-otp-entry';
import * as z from 'zod';

import {
  Button,
  // ControlledInput,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

const schema = z.object({
  phone: z
    .string({
      required_error: 'Phone number is required',
    })
    .min(10, 'Phone number must be at least 10 digits')
    .max(10, 'Phone number must be at most 10 digits'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading: boolean;
};

export const LoginForm = ({
  onSubmit = () => {},
  isLoading = false,
}: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const { width } = useWindowDimensions();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 px-4 pt-10">
          <LottieView
            source={require('@/../assets/lottie/spinning.json')}
            style={{
              width: width * 0.7,
              height: width * 0.7,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            loop={false}
            autoPlay
          />
          <View className="items-center justify-center">
            <Text
              testID="form-title"
              className="pb-2 text-center text-3xl font-bold"
            >
              Enter Your Mobile Number
            </Text>

            <Text className="mb-6 max-w-xs text-center !text-gray-500">
              We will send you a one-time password
            </Text>
          </View>
          <View className="flex-1">
            {/* <ControlledInput
              testID="phone"
              control={control}
              name="phone"
              keyboardType="phone-pad"
            /> */}
            <View className="flex-1 pb-10">
              <View className="flex-row">
                <Text className="self-center pr-2 text-2xl font-extrabold">
                  +91
                </Text>
                <OtpInput
                  numberOfDigits={10}
                  autoFocus={true}
                  type="numeric"
                  onFilled={Keyboard.dismiss}
                  theme={{
                    containerStyle: {
                      gap: 2,
                      flex: 1,
                      borderWidth: 1,
                      borderColor: 'white',
                      borderRadius: 10,
                      // paddingRight: 50,
                    },
                    pinCodeTextStyle: {
                      color: 'yellow',
                    },
                    pinCodeContainerStyle: {
                      flex: 1,
                      borderColor: 'transparent',
                      width: 2,
                    },
                    focusedPinCodeContainerStyle: {
                      borderColor: 'transparent',
                    },
                  }}
                />
              </View>
              <Button
                testID="request-otp-button"
                className="h-12 w-1/2 self-center"
                label="Request OTP"
                variant="default"
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
