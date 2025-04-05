// src/lib/fetcher.ts

import { api } from "./api";

export const fetcher = <T>(url: string) =>
  api.get<T>(url).then((res) => res.data);
