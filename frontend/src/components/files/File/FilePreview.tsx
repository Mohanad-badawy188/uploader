import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileItem } from "@/types/File";
import { FaDownload } from "react-icons/fa";
import { FiShare2, FiTrash2 } from "react-icons/fi";
import { formatFileSize } from "@/helper/formatFileSize";
import { getFileIcon } from "@/helper/GetFileIcon";
import { getFileStatus } from "@/helper/GetFileStatus";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { formatDate } from "@/helper/formatDate";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ConfirmDeleteModal from "@/app/modals/confirmDeleteModal";
import { downloadFile } from "@/helper/downloadFile";
export default function FilePreview({ file }: { file: FileItem }) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const renderFilePreview = () => (
    <div className="relative w-full min-h-52 aspect-square max-h-52 max-w-52 rounded-lg overflow-hidden shadow-lg border">
      <ImageWithFallback
        src={file.thumbnail || "/no-image.png"}
        alt="thumbnail"
        fill={true}
        className="object-contain overflow-hidden "
      />
    </div>
  );

  const shareFile = (file: FileItem) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/files/${file.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("File URL copied to clipboard");
  };
  const handleDelete = async () => {
    try {
      const res = await api.delete(`files/${file.id}`);
      if (res.data) {
        toast.success("File deleted successfully");
        router.push("/files");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Delete failed";
      toast.error(message);
    }
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-md">{getFileIcon(file)}</div>
            <div>
              <h2 className="text-xl font-semibold">{file.originalName}</h2>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)} • Uploaded{" "}
                {formatDate(file.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">{getFileStatus(file)}</div>
        </div>
        <div className="p-4 pt-2 h-52 w-auto flex items-center justify-center ">
          {renderFilePreview()}
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          <Button className="gap-2" onClick={() => downloadFile(file)}>
            <FaDownload className="h-4 w-4" /> Download
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => shareFile(file)}
          >
            <FiShare2 className="h-4 w-4" /> Share
          </Button>
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            variant="outline"
            className="gap-2 text-red-500 hover:text-red-600"
          >
            <FiTrash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </CardContent>
      <ConfirmDeleteModal
        description="Are you sure you want to delete this file? This action cannot be undone."
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </Card>
  );
}
