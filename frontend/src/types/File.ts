import { User } from "./User";

export type UploadFileStatusType =
  | "idle"
  | "uploading"
  | "processing"
  | "complete"
  | "error";

export interface UploadFileItemType {
  file: File;
  id: string;
  progress: number;
  status: UploadFileStatusType;
  preview?: string;
  error?: string;
  type: string;
}
export interface FileItem {
  id: string;
  originalName: string;
  path: string;
  mimetype: string;
  size: number;
  status: "pending" | "processing" | "complete" | "error";
  extractedText: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  user?: User;
}
