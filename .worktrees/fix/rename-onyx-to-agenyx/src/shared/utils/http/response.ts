/**
 * @file Axios response and error handlers.
 *
 * Contains the two helper functions used by the HTTP client to transform
 * raw Axios responses and errors into the standardised {@link ApiResponse} shape.
 */

import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '@/shared/types/api';

/**
 * Transforms an unknown error into a standard error {@link ApiResponse}.
 *
 * Handles three error categories:
 * - **AxiosError with response** — extracts server-provided message and details.
 * - **AxiosError without response (network)** — provides a connection-failure message.
 * - **Generic Error** — uses the error's own message.
 *
 * @param error - The caught error (Axios or otherwise).
 * @returns A standardised error response with `success: false`.
 */
export const handleAxiosError = <T>(error: unknown): ApiResponse<T> => {
  let errorMessage = 'Something went wrong. Please try again.';

  if (error instanceof AxiosError) {
    if (error.response) {
      errorMessage = (error.response.data as { message?: string })?.message || errorMessage;
    } else if (error.request) {
      errorMessage = 'Please check your internet connection.';
    } else {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return {
    success: false,
    message: errorMessage,
    data: null,
  };
};

/**
 * Transforms a successful Axios response into a standard {@link ApiResponse}.
 *
 * Marks the response as successful when the HTTP status is `200` or `201`.
 *
 * @param response - The Axios response object.
 * @returns A standardised success response.
 */
export const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  const { status, data: responseData } = response;

  const data = responseData.data !== undefined ? responseData.data : responseData;

  return {
    success: status === 200 || status === 201,
    message: responseData.message ?? '',
    data: data as T,
  };
};
