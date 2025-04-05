import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FileItem } from "@/types/File";
import { formatFileSize } from "@/helper/formatFileSize";
import { formatDate } from "@/helper/formatDate";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { getFileIcon } from "@/helper/GetFileIcon";
import { getFileStatus } from "@/helper/GetFileStatus";

interface FileCardProps {
  file: FileItem;
}

export function FileCard({ file }: FileCardProps) {
  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-2 p-3 pb-2 relative">
        <div className="bg-muted rounded-md p-1.5">{getFileIcon(file)}</div>
        <div className="flex-1 overflow-hidden">
          <h3
            className="font-medium text-xs sm:text-sm truncate mt-2"
            title={file.originalName}
          >
            {file.originalName}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
        <div className="absolute -top-2 right-2">{getFileStatus(file)}</div>
      </CardHeader>

      <CardContent className="p-3 h-24 sm:h-28 md:h-32 flex items-center justify-center">
        <div className="relative w-full max-w-full h-full max-h-full rounded-lg overflow-hidden shadow-sm border">
          <ImageWithFallback
            src={file.thumbnail || "/no-image.png"}
            alt="thumbnail"
            fill={true}
            className="object-contain"
          />
        </div>
      </CardContent>

      <CardFooter className="p-3 text-xs text-muted-foreground">
        {formatDate(file.createdAt)}
      </CardFooter>
    </Card>
  );
}
