"use server";

import { customFetch } from "@/lib/serverCustomFetch";
export async function getFileById(id: string) {
  return customFetch({
    url: `files/${id}`,
    cacheTag: `${id}`,
  });
}
