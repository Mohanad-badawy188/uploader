import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FileItem } from "@/types/File";

export const useFileById = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR<FileItem>(
    id ? `/files/${id}` : null,
    fetcher
  );

  return {
    file: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
