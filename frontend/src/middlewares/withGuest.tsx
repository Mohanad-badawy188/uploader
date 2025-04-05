/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkIsAuth } from "@/server-actions/auth";
import { redirect } from "next/navigation";

export function withGuest(Component: (props: any) => any) {
  return async function WrappedComponent(props: any) {
    const isLogged = await checkIsAuth();
    if (isLogged) {
      redirect("/");
    }

    return <Component {...props} />;
  };
}
