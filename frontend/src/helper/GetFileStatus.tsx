import { Badge } from "@/components/ui/badge";
import { FileItem } from "@/types/File";
import { FaCheckCircle, FaRegClock } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";

export const getFileStatus = (file: FileItem) => {
  switch (file.status) {
    case "complete":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <FaCheckCircle className="h-3 w-3 mr-1" /> Complete
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <FaRegClock className="h-3 w-3 mr-1" /> Processing
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          <FaClockRotateLeft className="h-3 w-3 mr-1" /> Pending
        </Badge>
      );
    case "error":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          <FiAlertCircle className="h-3 w-3 mr-1" /> Error
        </Badge>
      );
    default:
      return null;
  }
};
