import { getItem, removeItem, setItem } from '@/lib/storage';
import type { TokenType, UserType } from '@/types';

import { STORAGE_KEYS } from '../constants';

export const getToken = () => getItem<TokenType>(STORAGE_KEYS.TOKEN);
export const removeToken = () => removeItem(STORAGE_KEYS.TOKEN);
export const setToken = (value: TokenType) =>
  setItem<TokenType>(STORAGE_KEYS.TOKEN, value);

export const getUser = () => getItem<UserType>(STORAGE_KEYS.USER);
export const removeUser = () => removeItem(STORAGE_KEYS.USER);
export const setUser = (value: UserType) =>
  setItem<UserType>(STORAGE_KEYS.USER, value);
