import { api } from "@/lib/api";
import { FileItem } from "@/types/File";
import { toast } from "react-toastify";

export const downloadFile = async (file: FileItem) => {
  try {
    const response = await api.get(file.path, {
      responseType: "blob",
    });
    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    toast.error("Download failed");
  }
};
