import * as Updates from 'expo-updates';

import { showSuccessMessage } from '@/components/ui';

export async function checkForUpdates() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      showSuccessMessage('Update available, updating...');
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    //showErrorMessage(`Error Checking for updates: ${error}`);
  }
}
