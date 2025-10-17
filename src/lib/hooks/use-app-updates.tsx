/* eslint-disable max-lines-per-function */
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

type UpdateStatus = {
  hasOTAUpdate: boolean;
  hasStoreUpdate: boolean;
  requiresForceUpdate: boolean;
  updateUrl: string | null;
  message: string;
};

export const useAppUpdates = () => {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    hasOTAUpdate: false,
    hasStoreUpdate: false,
    requiresForceUpdate: false,
    updateUrl: null,
    message: '',
  });

  const checkOTAUpdate = useCallback(async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setUpdateStatus((prev) => ({
          ...prev,
          hasOTAUpdate: true,
          message:
            'A new update is available. Update to access the latest features and improvements.',
        }));
        return true;
      } else {
        setUpdateStatus((prev) => ({
          ...prev,
          hasOTAUpdate: false,
        }));
      }
      return false;
    } catch (error) {
      console.error('Error checking for OTA update:', error);
      return false;
    }
  }, []);

  const checkStoreUpdate = useCallback(async (versionData: any) => {
    if (!versionData) return false;

    try {
      const currentVersion = Application.nativeApplicationVersion || '1.0.0';
      const { latestVersion, minimumVersion, updateUrls } = versionData.data;

      const updateUrl =
        Platform.OS === 'android' ? updateUrls.android : updateUrls.ios;

      const isOutdated = compareVersions(currentVersion, latestVersion) < 0;
      const requiresForceUpdate =
        compareVersions(currentVersion, minimumVersion) < 0;

      if (isOutdated) {
        setUpdateStatus((prev) => ({
          ...prev,
          hasStoreUpdate: true,
          requiresForceUpdate,
          updateUrl,
          message: requiresForceUpdate
            ? 'A critical update is required to continue using the app.'
            : 'A new version is available on the App Store. Please update for the best experience.',
        }));
        return true;
      } else {
        setUpdateStatus((prev) => ({
          ...prev,
          hasStoreUpdate: false,
          requiresForceUpdate: false,
          updateUrl: null,
        }));
      }
      return false;
    } catch (error) {
      console.error('Error checking store version:', error);
      return false;
    }
  }, []);

  const resetUpdates = useCallback(() => {
    setUpdateStatus({
      hasOTAUpdate: false,
      hasStoreUpdate: false,
      requiresForceUpdate: false,
      updateUrl: null,
      message: '',
    });
  }, []);

  const compareVersions = (version1: string, version2: string): number => {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1 = v1Parts[i] || 0;
      const v2 = v2Parts[i] || 0;

      if (v1 < v2) return -1;
      if (v1 > v2) return 1;
    }

    return 0;
  };

  return {
    ...updateStatus,
    checkOTAUpdate,
    checkStoreUpdate,
    resetUpdates,
  };
};
