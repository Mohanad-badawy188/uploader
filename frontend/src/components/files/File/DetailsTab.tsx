import { FileItem } from "@/types/File";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { formatFileSize } from "@/helper/formatFileSize";
import { formatDate } from "@/helper/formatDate";

export default function DetailsTab({ file }: { file: FileItem }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          File Information
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Name</span>
            <span className="text-sm font-medium">{file.originalName}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm">Type</span>
            <span className="text-sm font-medium">{file.mimetype}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm">Size</span>
            <span className="text-sm font-medium">
              {formatFileSize(file.size)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm">Status</span>
            <span className="text-sm font-medium">{file.status}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Additional Information
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Created</span>
            <span className="text-sm font-medium">
              {formatDate(file.createdAt)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm">Last Modified</span>
            <span className="text-sm font-medium">
              {formatDate(file.updatedAt)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm">User Name</span>
            <span className="text-sm font-medium">{file.user?.name}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm">User Email</span>
            <span
              className="text-sm font-medium truncate max-w-[200px]"
              title={file.user?.email}
            >
              {file.user?.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
