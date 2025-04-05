"use client";

import { formatDate } from "@/helper/formatDate";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import NoItemsFound from "../common/NoItemsFound";
import { Skeleton } from "@/components/ui/skeleton";

interface UploadTrendItem {
  date: string;
  count: number;
}

interface UploadTrendsChartProps {
  data: UploadTrendItem[] | undefined;
  isLoading?: boolean;
}

export function UploadTrendsChart({ data, isLoading }: UploadTrendsChartProps) {
  if (isLoading) {
    return (
      <div className="w-full h-80 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-36 w-full mt-2" />
        <div className="flex justify-between mt-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    );
  }

  const formatedData = data?.map((item) => ({
    ...item,
    date: formatDate(item.date, true),
  }));

  if (!data?.length) return <NoItemsFound />;

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={formatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
