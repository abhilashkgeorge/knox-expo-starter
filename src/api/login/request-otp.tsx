import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Response = {
  status: string;
  code: number;
  message: string;
  data: object;
};
type Variables = {
  phone: string;
};

export const useRequestOtp = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/api/auth/request-otp',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
