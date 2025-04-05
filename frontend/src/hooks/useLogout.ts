import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSWRConfig } from "swr";

export const useLogout = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { mutate } = useSWRConfig();

  const logout = async () => {
    try {
      await api.post("/auth/logout");

      login(undefined);

      mutate("/auth/profile", null, false);

      router.push("/login");

      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);

      login(undefined);
      mutate("/auth/profile", null, false);
      router.push("/login");

      return { success: false, error };
    }
  };

  return { logout };
};
