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

interface UploadTrendItem {
  date: string;
  count: number;
}

interface UploadTrendsChartProps {
  data: UploadTrendItem[] | undefined;
}

export function UploadTrendsChart({ data }: UploadTrendsChartProps) {
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
