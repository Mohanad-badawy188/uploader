import { fetcher } from "@/lib/fetcher";
import { UserActivityLog } from "@/types/Logs";
import useSWR from "swr";

export const useLogs = (page = 1, limit = 10) => {
  const { data, error, isLoading, mutate } = useSWR<{
    data: UserActivityLog[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/logs?page=${page}&limit=${limit}`, fetcher);

  return {
    logs: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? limit,
    isLoading,
    isError: !!error,
    mutate,
  };
};
