import { NextRequest, NextResponse } from "next/server";

type Role = "USER" | "ADMIN";

interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  exp: number;
}

const protectedRoutes: Record<string, Role[]> = {
  "/": ["USER", "ADMIN"],
  "/admin": ["ADMIN"],
  "/files": ["USER", "ADMIN"],
  "/upload": ["USER", "ADMIN"],
  "/logs": ["ADMIN"],
  "/users": ["ADMIN"],
};

export function handleAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const route = Object.keys(protectedRoutes)
    .sort((a, b) => b.length - a.length)
    .find((path) => pathname.startsWith(path));

  if (!route) return NextResponse.next();

  if (!token) {
    return;
    // return NextResponse.redirect(new URL("/login", request.url));
  }
  try {
    // Decode JWT token (i dont wanna add jwt-decode for just getting the role ( my token has no epxiration) and i wont use it anywhere else  )
    const base64Payload = token.split(".")[1];
    const jsonPayload = Buffer.from(base64Payload, "base64").toString();
    const decoded: JwtPayload = JSON.parse(jsonPayload);
    // finding the protected routes based on roles here
    const allowedRoles = protectedRoutes[route];
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.rewrite(new URL("/404", request.url));
    }

    return NextResponse.next();
  } catch {
    // return NextResponse.redirect(new URL("/login", request.url));
  }
}
