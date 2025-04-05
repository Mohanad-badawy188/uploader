"use client";
import HeaderCards from "@/components/users/HeaderCards";
import { UsersTable } from "@/components/users/UserTable";
import { FileStatsResponse } from "../page";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useState } from "react";
import CustomPagination from "@/components/common/Pagination";
export interface UserWithStats {
  id: number;
  name: string;
  email: string;
  totalFiles: number;
  processedFiles: number;
  lastActivity: string | null;
  role: "USER" | "ADMIN";
}

export interface UsersWithStatsResponse {
  data: UserWithStats[];
  total: number;
  page: number;
  pageSize: number;
}

export default function UsersPage() {
  const [page, setPage] = useState(1);

  const { data: statsData, isLoading: statsLoading } =
    useSWR<FileStatsResponse>("/files/userFileStats", fetcher);
  const {
    data: users,
    mutate,
    isLoading: usersLoading,
  } = useSWR<UsersWithStatsResponse>(`/users?page=${page}`, fetcher);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Users Statistics
          </h2>
        </div>
        <div className="space-y-4">
          <HeaderCards
            data={statsData}
            totalUsers={users?.total}
            isLoading={statsLoading || usersLoading}
          />
          <UsersTable
            users={users?.data}
            refetch={mutate}
            isLoading={usersLoading}
          />
          <CustomPagination
            count={users?.total ?? 0}
            currentPage={page}
            handlePageChange={(page) => setPage(page)}
            pageSize={users?.pageSize ?? 10}
            isLoading={usersLoading}
          />
        </div>
      </main>
    </div>
  );
}
