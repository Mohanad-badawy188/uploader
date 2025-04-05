import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/helper/formatDate";
import { getFileStatus } from "@/helper/GetFileStatus";
import { FileItem } from "@/types/File";
import React from "react";

export default function FileProperties({ file }: { file: FileItem }) {
  return (
    <div>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">File Properties</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">File ID</p>
              <p className="text-sm font-medium">{file.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">MIME Type</p>
              <p className="text-sm font-medium">{file.mimetype}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="text-sm font-medium">
                {formatDate(file.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="text-sm font-medium">
                {formatDate(file.updatedAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1">{getFileStatus(file)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
