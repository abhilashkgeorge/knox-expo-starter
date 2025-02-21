import { canOpenURL, openURL } from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Linking } from 'react-native';
import type { StoreApi, UseBoundStore } from 'zustand';

export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export function useRequiredParams<T extends Record<string, string>>() {
  const params = useLocalSearchParams<T>();

  for (const key in params) {
    if (!params[key]) {
      throw new Error(`Required parameter "${key}" is missing`);
    }
  }
  return params;
}

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const handleCall = (phoneNumber: string) => {
  const url = `tel:${phoneNumber}`;

  canOpenURL(url)
    .then(() => {
      openURL(url);
    })
    .catch(() => Alert.alert('Error opening phone App'));
};
