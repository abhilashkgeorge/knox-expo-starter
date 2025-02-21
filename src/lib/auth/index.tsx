import { create } from 'zustand';

import type { TokenType, UserType } from '@/types';

import { createSelectors } from '../utils';
import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  setToken,
  setUser,
} from './utils';

interface AuthState {
  token: TokenType | null;
  user: UserType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (token: TokenType, user: UserType) => void;
  signOut: () => void;
  hydrate: () => void;
  hasRole: (role: string) => boolean;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  user: null,
  signIn: (token, user) => {
    setToken(token);
    setUser(user);
    set({ status: 'signIn', token, user });
  },
  signOut: () => {
    removeToken();
    removeUser();
    set({ status: 'signOut', token: null, user: null });
  },
  hydrate: () => {
    try {
      const userToken = getToken();
      const userData = getUser();
      if (userToken !== null && userData !== null) {
        get().signIn(userToken, userData);
      } else {
        get().signOut();
      }
    } catch (e) {
      get().signOut();
    }
  },
  hasRole: (role) => get().user?.roles.includes(role) ?? false,
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: TokenType, user: UserType) =>
  _useAuth.getState().signIn(token, user);
export const hydrateAuth = () => _useAuth.getState().hydrate();
