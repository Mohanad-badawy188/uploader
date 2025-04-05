// src/lib/fetcher.ts

import { api } from "./api";
import axios, { CancelTokenSource } from "axios";

// Store for active request cancellation tokens
const cancelTokens = new Map<string, CancelTokenSource>();

export const fetcher = <T>(url: string) => {
  // Cancel any existing request for this URL
  if (cancelTokens.has(url)) {
    cancelTokens.get(url)?.cancel("Operation canceled due to new request");
  }

  // Create a new cancel token
  const source = axios.CancelToken.source();
  cancelTokens.set(url, source);

  return api
    .get<T>(url, { cancelToken: source.token })
    .then((res) => {
      // Request completed successfully, remove the token
      cancelTokens.delete(url);
      return res.data;
    })
    .catch((error) => {
      // If this is not a cancellation error, remove the token
      if (!axios.isCancel(error)) {
        cancelTokens.delete(url);
      }
      throw error;
    });
};
