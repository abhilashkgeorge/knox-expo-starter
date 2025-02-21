import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Image, Text, View } from '@/components/ui';

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
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
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
            Enter Your Mobile Number
          </Text>

          <Text className="mb-6 max-w-xs text-center text-gray-500">
            We will send you a one-time password
          </Text>
        </View>
        <View className="p-6">
          <ControlledInput
            testID="phone"
            control={control}
            name="phone"
            keyboardType="phone-pad"
          />
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
    </KeyboardAvoidingView>
  );
};
