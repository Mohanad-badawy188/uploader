"use client";

import type React from "react";

import { useState, useRef } from "react";

import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PreviewFile from "@/components/upload/previewFile";
import { UploadFileItemType } from "@/types/File";
import { api } from "@/lib/api";
import axios from "axios";
import { validateFile } from "@/helper/validateFile";
import { withAuthClient } from "@/middlewares/withAuthClient";

function UploadPage() {
  const [file, setFile] = useState<UploadFileItemType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileToServer = async (
    file: File,
    onProgress: (percent: number) => void
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            onProgress(percent);
          }
        },
      });
      toast.success("File uploaded successfully");
      return res.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Failed to upload file";

      toast.error(message);
      throw err;
    }
  };

  const processFile = async (file: File): Promise<void> => {
    const id = Math.random().toString(36).substring(2, 9);
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    const newFileItem: UploadFileItemType = {
      file,
      id,
      progress: 0,
      status: "uploading",
      type: file.type,
    };

    setFile(newFileItem);

    try {
      await uploadFileToServer(file, (percent) => {
        setFile((f) => (f && f.id === id ? { ...f, progress: percent } : f));
      });
    } catch {
      setFile((f) =>
        f && f.id === id ? { ...f, status: "error", error: "Upload failed" } : f
      );
      return;
    }

    setFile((f) => (f && f.id === id ? { ...f, status: "processing" } : f));

    setFile((f) =>
      f && f.id === id
        ? {
            ...f,
            status: "complete",
            progress: 100,
          }
        : f
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) await processFile(droppedFile);
  };
  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) await processFile(selectedFile);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="  w-10/12 m-auto mt-10  bg-white rounded-lg shadow-md">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-4 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <FaUpload className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">Drag & Drop your files here</h3>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse from your computer
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          // so the user can add the same file he deleted earlier
          key={file?.type}
        />
        <Button onClick={handleButtonClick} variant="outline" className="mt-2">
          Select Files
        </Button>
        <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
          Supported: PDF, PNG, JPG, CSV, XLSX · Max size: 15MB
        </p>
      </div>

      {file && <PreviewFile file={file} onRemove={removeFile} />}
    </div>
  );
}

// Apply the auth middleware to restrict this page to authenticated users
export default withAuthClient(UploadPage);
