import {
  type CheckVersionResponse,
  checkVersionResponseSchema,
} from '@/schemas';

import { client } from '../common';
import { handleError } from '../common/error-handler';

export const checkAppVersion = async (): Promise<CheckVersionResponse> => {
  try {
    //TODO: Change the app name endpoint here please as per te app.
    const response = await client.get(`/api/lco/app/{app-Name}-version`);
    const parsedResponse = checkVersionResponseSchema.parse(response.data);
    return parsedResponse;
  } catch (error) {
    const errorMessage = handleError(error, {
      defaultMessage: 'Failed to fetch app version.',
    });
    throw new Error(errorMessage);
  }
};
