"use client";

import Spinner from "@/components/common/Spinner";
import { FileContainer } from "@/components/files/File/FileContainer";
import { useFileById } from "@/hooks/useFileById";
import { useParams } from "next/navigation";
import { withAuthClient } from "@/middlewares/withAuthClient";

function FilePage() {
  const params = useParams();
  const id = params?.id as string;
  const { file, isLoading, isError } = useFileById(id);

  if (isLoading) {
    return (
      <main className="mx-auto py-8 px-4 flex items-center justify-center min-h-[50vh]">
        <Spinner className="w-8 h-8" />
      </main>
    );
  }

  if (isError || !file) {
    return (
      <main className="mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">File not found</h2>
          <p className="text-gray-500 mt-2">
            The file you are looking for does not exist or you may not have
            permission to view it.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto py-8 px-4">
      <FileContainer file={file} />
    </main>
  );
}

export default withAuthClient(FilePage);
