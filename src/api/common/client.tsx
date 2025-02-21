import { Env } from '@env';
import axios from 'axios';

import { showErrorMessage } from '@/components/ui';
import { signOut } from '@/lib';
import { getToken, getUser, removeToken, removeUser } from '@/lib/auth/utils';

export const client = axios.create({
  baseURL: Env.API_URL,
});

client.interceptors.request.use(
  (config) => {
    const token = getToken()?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      removeUser();
      signOut();
    }
    if (error.response?.status === 403) {
      const userRoles = getUser().roles;
      showErrorMessage(`Access denied for role: ${userRoles}, Elevate!`);
    }
    return Promise.reject(error.response.data);
  }
);
