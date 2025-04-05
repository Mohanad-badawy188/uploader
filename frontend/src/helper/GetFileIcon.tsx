import { FileItem } from "@/types/File";
import { BsFileImage } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";
import { ImFilePdf } from "react-icons/im";
import { LuFileSpreadsheet } from "react-icons/lu";

export const getFileIcon = (file: FileItem) => {
  switch (file.mimetype) {
    case "application/pdf":
      return <ImFilePdf className="h-6 w-6 text-red-600" />;

    case "image/png":
    case "image/jpeg":
      return <BsFileImage className="h-6 w-6 text-blue-500" />;

    case "text/csv":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return <LuFileSpreadsheet className="h-6 w-6 text-green-600" />;

    default:
      return <FaRegFileAlt className="h-6 w-6 text-gray-500" />;
  }
};
