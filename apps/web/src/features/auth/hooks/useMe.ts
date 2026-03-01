import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/stores/auth.store";

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const data = await authApi.me();
      setUser(data.data);
      return data.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
