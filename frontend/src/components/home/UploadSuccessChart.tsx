"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface UploadSuccessChartProps {
  complete: number;
  error: number;
}

const COLORS = ["#22c55e", "#ef4444"]; // ✅ success = green, error = red

export function UploadSuccessChart({
  complete,
  error,
}: UploadSuccessChartProps) {
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
