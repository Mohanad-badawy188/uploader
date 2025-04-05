import { FileItem } from "@/types/File";
import React from "react";

export default function ContentTab({ file }: { file: FileItem }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Extracted Text
      </h3>
      <div className="p-4 bg-muted/30 rounded-lg border whitespace-pre-line text-sm">
        {file.extractedText}
      </div>
    </div>
  );
}
