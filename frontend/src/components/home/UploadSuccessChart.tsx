"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface UploadSuccessChartProps {
  complete: number;
  error: number;
  isLoading?: boolean;
}

const COLORS = ["#22c55e", "#ef4444"]; // ✅ success = green, error = red

export function UploadSuccessChart({
  complete,
  error,
  isLoading,
}: UploadSuccessChartProps) {
  if (isLoading) {
    return (
      <div className="relative w-full h-64 flex items-center justify-center">
        <Skeleton className="h-[220px] w-[220px] rounded-full" />
        <Skeleton className="absolute inset-0 m-auto h-[100px] w-[100px] rounded-full" />
      </div>
    );
  }

  const total = complete + error;
  const successRate = total === 0 ? 0 : Math.round((complete / total) * 100);

  const data = [
    { name: "Success", value: complete },
    { name: "Failed", value: error },
  ];

  return (
    <div className="relative w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={110}
            dataKey="value"
            nameKey="name"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* 💡 Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold text-green-600">
          {successRate}%
        </span>
        <span className="text-sm text-muted-foreground">Success Rate</span>
      </div>
    </div>
  );
}
