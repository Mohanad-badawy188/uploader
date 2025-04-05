import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "../ui/button";

interface Props {
  count: number;
  handlePageChange: (page: number) => void;
  currentPage: number;
  isLoading: boolean;
  pageSize: number;
}

const CustomPagination = ({
  count = 1,
  handlePageChange,
  isLoading,
  currentPage,
  pageSize,
}: Props) => {
  if (!count || count <= 1) return null;

  const maxTabs = 5;
  const totalPages = Math.ceil(count / pageSize);

  const chanePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handlePageChange(newPage);
    }
  };

  const renderPageTab = (page: number) => (
    <li key={page}>
      <Button
        disabled={isLoading}
        onClick={() => handlePageChange(page)}
        className={`cursor-pointer ${
          page === currentPage
            ? "text-white bg-primary font-bold"
            : "text-gray-700"
        }`}
        variant={page === currentPage ? "default" : "outline"}
      >
        {page}
      </Button>
    </li>
  );

  const renderPageNumbers = () => {
    if (!pageSize) return null;

    const pages: (number | "...")[] = [];

    if (totalPages <= maxTabs) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const isNearStart = currentPage <= 3;
      const isNearEnd = currentPage >= totalPages - 2;

      if (isNearStart) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (isNearEnd) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages.map((page, idx) =>
      page === "..." ? (
        <li
          key={`ellipsis-${idx}`}
          className="text-muted-foreground px-2 text-sm select-none"
        >
          ...
        </li>
      ) : (
        renderPageTab(page)
      )
    );
  };
  if (count <= pageSize) return;

  return (
    <div className="flex items-center justify-center my-5 w-9/12 m-auto mb-20 ">
      <ul className="flex items-center justify-between sm:space-x-5 md:space-x-7 space-x-2">
        <li>
          <Button
            disabled={isLoading || currentPage === 1}
            onClick={() => chanePage(currentPage - 1)}
            className="cursor-pointer p-2"
          >
            <FaChevronLeft />
          </Button>
        </li>
        {renderPageNumbers()}
        <li>
          <Button
            onClick={() => chanePage(currentPage + 1)}
            className="cursor-pointer p-2"
            disabled={isLoading || currentPage === totalPages}
          >
            <FaChevronRight />
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default CustomPagination;
