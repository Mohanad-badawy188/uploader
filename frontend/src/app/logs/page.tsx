"use client";

import { useState } from "react";
import NoItemsFound from "@/components/common/NoItemsFound";
import Spinner from "@/components/common/Spinner";
import { LogsTable } from "@/components/logs/LogsTable";
import { useLogs } from "@/hooks/useLogs";
import CustomPagination from "@/components/common/Pagination";
import { withAuthClient } from "@/middlewares/withAuthClient";

function LogsPage() {
  const [page, setPage] = useState(1);
  const { logs, isLoading, total, pageSize } = useLogs(page);

  return (
    <div className="mx-10 py-10">
      <h1 className="text-3xl font-bold mb-6">User Activity Logs</h1>
      {isLoading ? (
        <Spinner />
      ) : logs.length ? (
        <>
          <LogsTable logs={logs} />
          <CustomPagination
            count={total}
            handlePageChange={setPage}
            currentPage={page}
            isLoading={isLoading}
            pageSize={pageSize}
          />
        </>
      ) : (
        <NoItemsFound />
      )}
    </div>
  );
}

// Apply the auth middleware to restrict this page to admin users
export default withAuthClient(LogsPage);
