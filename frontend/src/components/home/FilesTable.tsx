"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LuArrowUpDown } from "react-icons/lu";
import { FiFile, FiMoreHorizontal } from "react-icons/fi";
import { FileItem } from "@/types/File";
import { formatFileSize } from "@/helper/formatFileSize";
import { formatDate } from "@/helper/formatDate";
import { getFileStatus } from "@/helper/GetFileStatus";
import { getMimeDisplayName } from "@/helper/getMimeDisplayName";
import Link from "next/link";
import { downloadFile } from "@/helper/downloadFile";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { useState } from "react";
import ConfirmDeleteModal from "@/app/modals/confirmDeleteModal";

export default function FilesTable({
  files,
  handleSorting,
  sorting,
  refreshFiles,
}: {
  files: FileItem[];
  handleSorting: (sorting: "asc" | "desc") => void;
  sorting: string;
  refreshFiles: () => void;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const openDeleteModal = (file: FileItem) => {
    setSelectedFile(file);
    setIsDeleteModalOpen(true);
  };
  const handleDelete = async () => {
    try {
      if (!selectedFile) return;
      const res = await api.delete(`files/${selectedFile.id}`);
      if (res.data) {
        refreshFiles();
        toast.success("File deleted successfully");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Delete failed";
      toast.error(message);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent"
                onClick={() =>
                  handleSorting(sorting === "asc" ? "desc" : "asc")
                }
              >
                <span>Uploaded</span>
                <LuArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FiFile className="h-4 w-4 text-muted-foreground" />
                  {file.originalName}
                </div>
              </TableCell>
              <TableCell>{getMimeDisplayName(file.mimetype)}</TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>{formatDate(file.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFileStatus(file)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <FiMoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/files/${file.id}`}>View details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadFile(file)}>
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => openDeleteModal(file)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmDeleteModal
        description="Are you sure you want to delete this file? This action cannot be undone."
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
