"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaUpload } from "react-icons/fa";
import FilesTable from "@/components/home/FilesTable";
import { StatsCards } from "@/components/home/StatsCard";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFiles } from "@/hooks/useFiles";
import { ImSpinner2 } from "react-icons/im";
import NoItemsFound from "@/components/common/NoItemsFound";
import { UploadSuccessChart } from "@/components/home/UploadSuccessChart";
import { UploadTrendsChart } from "@/components/home/UploadTrendChart";
import CustomPagination from "@/components/common/Pagination";
export interface FileStatResult {
  status: "fulfilled" | "rejected";
  value?: number;
  reason?: unknown;
}

export interface FileStatsResponse {
  totalFiles: FileStatResult;
  completeCount: FileStatResult;
  errorCount: FileStatResult;
  processingCount: FileStatResult;
}
interface UploadTrendItem {
  date: string;
  count: number;
}

export default function Home() {
  const [fileType, setFileType] = useState("all");
  const [sorting, setSorting] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const router = useRouter();
  const { data } = useSWR<FileStatsResponse>(
    fileType === "all"
      ? "/files/userFileStats"
      : `/files/userFileStats?type=${fileType}`,
    fetcher
  );
  const { data: uploadData } = useSWR<UploadTrendItem[]>(
    "/files/upload-trends",
    fetcher
  );
  const {
    files,
    isLoading: TableLoading,
    mutate: refreshFiles,
    total,
    isLoading,
  } = useFiles({
    sortBy: "createdAt",
    sortOrder: sorting,
    limit: 5,
    page,

    type: fileType === "all" ? undefined : fileType,
  });
  const handleSorting = (sorting: "asc" | "desc") => {
    setSorting(sorting);
  };
  useEffect(() => {
    setPage(1);
  }, [fileType]);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
        <div className="ml-auto">
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>

              <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          size="sm"
          className="h-9 gap-1 "
          onClick={() => router.push("/upload")}
        >
          <FaUpload className="h-3.5 w-3.5" />
          <span className="hidden sm:inline-block">Upload</span>
        </Button>
      </div>

      <StatsCards data={data} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upload Success Rate</CardTitle>
            <CardDescription>Success vs. failure rate</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadSuccessChart
              complete={data?.completeCount.value || 0}
              error={data?.errorCount.value || 0}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Upload Trends</CardTitle>
            <CardDescription>Number of uploads over time</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadTrendsChart data={uploadData ?? []} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
          <CardDescription>
            recent uploaded files and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {files.length ? (
            TableLoading ? (
              <div className="flex items-center justify-center min-h-40">
                <ImSpinner2 className="animate-spin size-10" />
              </div>
            ) : (
              <>
                <FilesTable
                  files={files}
                  handleSorting={handleSorting}
                  sorting={sorting}
                  refreshFiles={refreshFiles}
                />
                <CustomPagination
                  count={total ?? 0}
                  currentPage={page}
                  handlePageChange={(page) => setPage(page)}
                  pageSize={5}
                  isLoading={isLoading}
                />
              </>
            )
          ) : (
            <NoItemsFound />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
