"use server";

import { customFetch } from "@/lib/serverCustomFetch";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const login = async (body: any) => {
  const response = await customFetch({
    url: "auth/login",
    method: "POST",
    body,
  });

  const { accessToken } = response;
  const cookieStore = await cookies();
  // Set HTTP-only cookie with the token
  cookieStore.set("token", accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "none",
  });

  revalidateTag("auth/login");

  return response;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signup = async (body: any) => {
  const response = await customFetch({
    url: "auth/signup",
    method: "POST",
    body,
  });

  const { accessToken } = response;
  const cookieStore = await cookies();

  cookieStore.set("token", accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "none",
  });

  return response;
};
export const checkIsAuth = async () => {
  const cookieStore = cookies();
  const tokenCookie = await cookieStore;

  const token = tokenCookie.get("token")?.value;
  if (token) {
    return !!token;
  } else {
    return false;
  }
};
export const logoutUser = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("token");

  revalidateTag("v1/auth/login");

  return { message: "Logged out successfully" };
};
