import { handleAuth } from "@/middlewares/handleAuth";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return handleAuth(request);
}

export const config = {
  matcher: [
    "/",
    "/upload/:path*",
    "/files/:path*",
    "/profile",
    "/logs",
    "/users",
  ],
};
