import { type AxiosError } from 'axios';

type ErrorHandlerOptions = {
  defaultMessage?: string;
};

export const handleError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
): string => {
  const defaultMessage =
    options.defaultMessage || 'An unexpected error occurred.';

  if (typeof error === 'object' && error !== null) {
    if (isAxiosError(error)) {
      let axiosError = error as any;

      if (!axiosError.response) {
        return 'Please check your internet connection';
      }

      if (axiosError.response?.data) {
        const errorMessage = axiosError.response.data?.message;
        return errorMessage || defaultMessage;
      }

      axiosError = error as AxiosError;

      if (axiosError.message) {
        return axiosError.message;
      }
    }

    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }

    if ('code' in error && 'status' in error && 'message' in error) {
      return extractErrorMessage(error) || defaultMessage;
    }
  }

  console.error('Unexpected Error:', error);
  return defaultMessage;
};

const isAxiosError = (error: unknown): error is AxiosError => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

const extractErrorMessage = (data: any): string | undefined => {
  if (typeof data === 'object' && data !== null) {
    if ('message' in data && typeof data.message === 'string') {
      return data.message;
    }

    if (
      'errors' in data &&
      typeof data.errors === 'object' &&
      data.errors !== null
    ) {
      if ('name' in data.errors) {
        return data.errors.name;
      }

      const errorValues = Object.values(data.errors);
      if (errorValues.length > 0) {
        const firstError = errorValues[0];
        if (typeof firstError === 'string') {
          return firstError;
        } else if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0];
        }
      }
    }
  }

  return undefined;
};
