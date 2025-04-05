import { FileItem } from "@/types/File";
import { FileCard } from "./FileCard";
import Link from "next/link";
import { FaUpload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Spinner from "../common/Spinner";

interface FileListProps {
  files: FileItem[];
  isLoading?: boolean;
}

export default function FileList({ files, isLoading = false }: FileListProps) {
  if (isLoading) {
    return <Spinner />;
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 px-4 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mb-4">
          No files found. Upload a file or adjust your filters.
        </p>
        <Link href="/upload">
          <Button size="sm" className="gap-2">
            <FaUpload className="h-4 w-4" />
            Upload Files
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {files.map((file) => (
        <Link href={`/files/${file.id}`} key={file.id} className="block h-full">
          <FileCard file={file} />
        </Link>
      ))}
    </div>
  );
}
