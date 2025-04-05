"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaSearch } from "react-icons/fa";
import { ImSortAlphaAsc, ImSortAlphaDesc } from "react-icons/im";
import FileList from "@/components/files/FileList";
import { useFiles } from "@/hooks/useFiles";
import Pagination from "@/components/common/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

export default function Page() {
  // UI state
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search to avoid excessive requests
  const debouncedSearch = useDebounce(searchInput, 300);

  const sortMap = {
    date: "createdAt",
    name: "originalName",
    size: "size",
  };

  // Use the files hook with debounced search
  const { files, isLoading, isError, page, total, pageSize } = useFiles({
    search: debouncedSearch,
    type: typeFilter !== "all" ? typeFilter : undefined,
    sortBy: sortMap[sortBy],
    sortOrder: sortDirection,
    page: currentPage,
    limit: 8,
  });

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  }, [sortDirection]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, debouncedSearch, sortBy, sortDirection]);

  return (
    <main className="p-3 md:p-6 space-y-4 md:space-y-6 overflow-auto">
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="relative w-full">
          <FaSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-10 w-full py-2"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="application/pdf">PDF</SelectItem>
              <SelectItem value="image/png">PNG</SelectItem>
              <SelectItem value="image/jpeg">JPEG</SelectItem>
              <SelectItem value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                XLSX
              </SelectItem>
              <SelectItem value="text/csv">CSV</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value: "date" | "name" | "size") =>
              setSortBy(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Upload Date</SelectItem>
              <SelectItem value="name">File Name</SelectItem>
              <SelectItem value="size">File Size</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={toggleSortDirection}>
            {sortDirection === "asc" ? (
              <ImSortAlphaAsc className="h-4 w-4" />
            ) : (
              <ImSortAlphaDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isError ? (
        <div className="text-center py-8 px-4 border rounded-lg bg-red-50">
          <p className="text-red-500">
            Failed to load files. Please try again later.
          </p>
        </div>
      ) : (
        <div>
          <FileList files={files} isLoading={isLoading} />
          {!isLoading && (
            <Pagination
              handlePageChange={handlePageChange}
              count={total}
              currentPage={page}
              isLoading={isLoading}
              pageSize={pageSize}
            />
          )}
        </div>
      )}
    </main>
  );
}
