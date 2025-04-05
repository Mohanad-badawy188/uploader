"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRegUser } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/helper/formatDate";
import Spinner from "@/components/common/Spinner";
import { BsArrowLeft } from "react-icons/bs";
import { FileStatsResponse } from "@/components/home/StatsCard";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data } = useSWR<FileStatsResponse>(
    "/files/userFileStats?adminViewOwn=true",
    fetcher
  );
  const total = data?.totalFiles.value || 0;
  const complete = data?.completeCount.value || 0;
  const successRate = total > 0 ? (complete / total) * 100 : 0;
  if (!user) return <Spinner />;
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center "
        >
          <BsArrowLeft className="me-2" /> Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <FaRegUser className="size-10" />
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {formatDate(user?.createdAt, true)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">
                File Processing Statistics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Total Files</p>
                  <p className="text-2xl font-bold">{data?.totalFiles.value}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {data?.completeCount.value}
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-600">Errors</p>
                  <p className="text-2xl font-bold text-red-600">
                    {data?.errorCount.value}
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-600">Processing</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {data?.processingCount.value}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${successRate.toFixed(1)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {successRate.toFixed(1)}% of files processed successfully
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
