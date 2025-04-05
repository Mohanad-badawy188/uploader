"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileItem } from "@/types/File";
import { FaArrowLeft } from "react-icons/fa";
import FilePreview from "./FilePreview";
import FileDetails from "./FileDetails";
import FileProperties from "./FileProperties";

interface FileDetailsProps {
  file: FileItem;
}

export function FileContainer({ file }: FileDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/files">
            <FaArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">File Details</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FilePreview file={file} />
          <FileDetails file={file} />
        </div>

        <FileProperties file={file} />
      </div>
    </div>
  );
}
