import { FileContainer } from "@/components/files/File/FileContainer";
import { getFileById } from "@/server-actions/files";
import { notFound } from "next/navigation";

export default async function FilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;

    const file = await getFileById(id);

    return (
      <main className=" mx-auto py-8 px-4">
        <FileContainer file={file} />
      </main>
    );
  } catch {
    notFound();
  }
}
