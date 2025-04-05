import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/constants/file";

export const validateFile = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Unsupported file type";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File too large (max 15MB)";
  }
  return null;
};
