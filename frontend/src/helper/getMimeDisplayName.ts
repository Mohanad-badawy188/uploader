export function getMimeDisplayName(mime: string): string {
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "image/png": "PNG",
    "image/jpeg": "JPEG",
    "text/csv": "CSV",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  };

  return map[mime] || mime;
}
