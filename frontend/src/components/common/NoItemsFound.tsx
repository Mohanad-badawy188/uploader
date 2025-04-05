import { ReactNode } from "react";

interface NoItemsFoundProps {
  header?: string;
  description?: ReactNode;
  className?: string;
}

export default function NoItemsFound({
  header = "No Data available",
  description = null,
  className = "",
}: NoItemsFoundProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg border-2 py-3 border-dashed border-gray-300 ${className}`}
    >
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h3 className="mt-1 text-base font-medium text-red-500">{header}</h3>
        {description && <div className="mt-6">{description}</div>}
      </div>
    </div>
  );
}
