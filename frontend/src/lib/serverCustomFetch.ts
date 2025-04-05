import { cookies } from "next/headers";

export async function customFetch({
  url,
  cacheTag,
  body = null,
  method = "GET",
  contentType = "application/json",
}: {
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  method?: string;
  withToken?: boolean;
  contentType?: string;
  cacheTag?: string;
}) {
  const headers: Record<string, string> = {};
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  console.log(baseURL);
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  headers["cookie"] = cookieString;
  if (contentType && contentType !== "multipart/form-data") {
    headers["Content-Type"] = contentType;
  }
  const finalbody =
    method !== "GET" && body
      ? contentType === "application/json"
        ? JSON.stringify(body)
        : body
      : undefined;
  const response = await fetch(`${baseURL}/${url}`, {
    method: method,
    headers: headers,
    credentials: "include",

    body: finalbody,

    next: {
      revalidate: 0,
      // revalidate: method !== "GET" ? 0 : cacheTime,
      ...(cacheTag && { tags: [cacheTag] }),
    },
  });
  if (!response.ok) {
    const errorData = await response.json(); // 👈 parse backend error
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.body ? await response.json() : {};
}
