import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { signIn } from '@/lib';

import { client } from '../common';

type Variables = { phone: string; otp: string };
type Response = {
  status: string;
  code: number;
  message: string;
  data: { id: string; phone: string };
};

export const useVerifyOtp = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/api/auth/verify-otp',
      method: 'POST',
      data: variables,
    }).then((response) => {
      const token = {
        access: response.headers['authorization'],
        refresh: '',
      };
      const roles = JSON.parse(response.headers['roles']) as string[];
      const user = {
        id: response.data.data.id,
        phone: response.data.data.phone,
        roles: roles,
      };
      signIn(token, user);
      return response.data;
    }),
});
