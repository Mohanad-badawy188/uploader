import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { FaCheckCircle, FaFileInvoice } from "react-icons/fa";
import { FiAlertCircle, FiFileText } from "react-icons/fi";
import { Button } from "../ui/button";
import { UploadFileItemType, UploadFileStatusType } from "@/types/File";
import { MdDeleteOutline } from "react-icons/md";

type Props = {
  file: UploadFileItemType;
  onRemove: () => void;
};
export default function PreviewFile({ file, onRemove }: Props) {
  const getStatusIcon = (status: UploadFileStatusType) => {
    if (status === "complete")
      return <FaCheckCircle className="size-5 text-green-500" />;
    if (status === "error")
      return <FiAlertCircle className="size-5 text-red-500" />;
    return;
  };

  return (
    <div>
      {" "}
      <div className="mt-8 space-y-4">
        <h3 className="font-medium text-lg">Uploaded File</h3>
        <div className="space-y-4">
          <Card key={file.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="bg-muted rounded-md p-2 mt-1">
                    {file.file.type.startsWith("image/") ? (
                      <FaFileInvoice className="h-6 w-6 text-primary" />
                    ) : (
                      <FiFileText className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{file.file.name}</p>
                      {getStatusIcon(file.status)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span>{(file.file.size / 1024).toFixed(2)} KB</span>
                      <span className="mx-2">•</span>
                      <span>{file.file.type || "Unknown type"}</span>
                    </div>

                    {(file.status === "uploading" ||
                      file.status === "processing") && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.status === "uploading"
                            ? `Uploading: ${file.progress}%`
                            : "Processing file..."}
                        </p>
                      </div>
                    )}

                    {file.preview && (
                      <div className="mt-3 bg-muted p-2 rounded-md">
                        <p className="text-xs font-mono whitespace-pre-wrap overflow-hidden text-ellipsis max-h-24">
                          {file.preview}
                        </p>
                      </div>
                    )}

                    {file.error && (
                      <p className="text-sm text-red-500 mt-2">{file.error}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5 rounded-full ms-2 text-red-500 hover:text-red-700"
                  onClick={onRemove}
                >
                  <MdDeleteOutline className="size-5" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
