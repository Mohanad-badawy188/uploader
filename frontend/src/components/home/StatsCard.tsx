import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BsCheckCircle } from "react-icons/bs";
import { FaFile } from "react-icons/fa6";
import { LuClock4, LuFileX2 } from "react-icons/lu";
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
export function StatsCards({ data }: { data: FileStatsResponse | undefined }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Files</CardTitle>
          <FaFile className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.totalFiles.value || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Successful</CardTitle>
          <BsCheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.completeCount.value || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <LuFileX2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.errorCount.value || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processing</CardTitle>
          <LuClock4 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.processingCount.value || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
