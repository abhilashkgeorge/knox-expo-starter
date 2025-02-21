import { useRouter } from 'expo-router';
import React from 'react';

import { useRequestOtp } from '@/api/login/request-otp';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import {
  FocusAwareStatusBar,
  showErrorMessage,
  showSuccessMessage,
} from '@/components/ui';

export default function Login() {
  const router = useRouter();
  const { mutate: requestOtp, isPending } = useRequestOtp();

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    requestOtp(
      {
        phone: data.phone,
      },
      {
        onSuccess: () => {
          showSuccessMessage('OTP sent successfully');
          router.push({
            pathname: '/otp',
            params: {
              phone: data.phone,
            },
          });
        },
        onError: (error) => {
          showErrorMessage(`Error Requesting OTP ${error.message}`);
        },
      }
    );
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} isLoading={isPending} />
    </>
  );
}
