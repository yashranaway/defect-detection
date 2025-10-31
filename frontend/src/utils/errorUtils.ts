// Error handling utilities

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return 'Resource not found';
    } else if (error.status === 500) {
      return 'Internal server error';
    } else if (error.status === 400) {
      return 'Bad request';
    } else {
      return error.message || 'An unknown API error occurred';
    }
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return 'An unknown error occurred';
  }
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError && 
    (error.message.includes('fetch') || 
     error.message.includes('network') || 
     error.message.includes('Failed to fetch'));
};

export const createTimeoutPromise = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new ApiError('Request timeout', 408));
    }, ms);
    
    promise.then(
      (result) => {
        clearTimeout(timeout);
        resolve(result);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      }
    );
  });
};