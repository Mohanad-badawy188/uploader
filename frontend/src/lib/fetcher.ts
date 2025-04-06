import { api } from "./api";

const fileListControllers = {
  current: null as AbortController | null,
};

const abortControllers = new Map<string, AbortController>();

export const fetcher = <T>(url: string, init?: RequestInit) => {
  if (url.startsWith("/files?") || url === "/files") {
    // Cancel any existing file list request
    if (fileListControllers.current) {
      try {
        fileListControllers.current.abort();
        console.log(`Aborting previous file list request`);
      } catch (e) {
        console.error("Error aborting file list request:", e);
      }
    }

    fileListControllers.current = new AbortController();
    const controller = fileListControllers.current;
    console.log(`New file list request started: ${url}`);

    return api
      .get<T>(url, {
        signal: controller.signal,
        withCredentials: true,
        params: { _t: new Date().getTime() },
      })
      .then((res) => {
        console.log(`File list request completed: ${url}`);
        if (fileListControllers.current === controller) {
          fileListControllers.current = null;
        }
        return res.data;
      })
      .catch((error) => {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          console.log(`File list request was aborted: ${url}`);
          throw new Error("AbortError");
        } else {
          console.error(`File list request error for ${url}:`, error);
          if (fileListControllers.current === controller) {
            fileListControllers.current = null;
          }
          throw error;
        }
      });
  }

  if (abortControllers.has(url)) {
    try {
      const controller = abortControllers.get(url);
      controller?.abort();
      console.log(`Aborting previous request for: ${url}`);
    } catch (e) {
      console.error("Error aborting request:", e);
    } finally {
      abortControllers.delete(url);
    }
  }

  const controller = new AbortController();
  abortControllers.set(url, controller);
  console.log(`New request started for: ${url}`);

  return api
    .get<T>(url, {
      signal: controller.signal,
      params: { _t: new Date().getTime() },
    })
    .then((res) => {
      console.log(`Request completed for: ${url}`);
      abortControllers.delete(url);
      return res.data;
    })
    .catch((error) => {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        console.log(`Request was aborted for: ${url}`);
        throw new Error("AbortError");
      } else {
        console.error(`Request error for ${url}:`, error);
        abortControllers.delete(url);
        throw error;
      }
    });
};
