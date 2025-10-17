import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useState } from 'react';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const checkConnection = useCallback(async () => {
    const networkState = await NetInfo.fetch();
    setIsConnected(networkState.isConnected);
    return networkState.isConnected;
  }, []);

  useEffect(() => {
    checkConnection();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [checkConnection]);

  return { isConnected, checkConnection };
};
