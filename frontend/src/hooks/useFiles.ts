import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { manageQueryString } from "@/helper/manageQueryStrings";
import { FileItem } from "@/types/File";
import { useEffect } from "react";

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

  const { data, error, isLoading, mutate } = useSWR<FileResponse>(
    key,
    fetcher,
    {
      keepPreviousData: true, // Keep showing previous data while loading new data
      revalidateOnFocus: false, // Don't reload when window refocuses
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
    }
  );

  // Handle any cleanup when the query changes
  useEffect(() => {
    // Return cleanup function that will be called when the component unmounts
    // or when the query changes
    return () => {
      // Cleanup will happen automatically through the fetcher
    };
  }, [key]);

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
