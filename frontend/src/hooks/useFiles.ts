// src/hooks/useFiles.ts
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { manageQueryString } from "@/helper/manageQueryStrings";
import { FileItem } from "@/types/File";

type Params = {
  search?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

type FileResponse = {
  data: FileItem[];
  total: number;
  page: number;
  pageSize: number;
};

export const useFiles = (params: Params) => {
  const query = manageQueryString(params);
  const key = query ? `/files?${query}` : "/files";

  const { data, error, isLoading, mutate } = useSWR<FileResponse>(key, fetcher);

  return {
    files: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 10,
    isLoading,
    isError: !!error,
    mutate,
  };
};
