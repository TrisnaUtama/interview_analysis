import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isAuthenticated, clearUser } = useAuthStore();

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      navigate({ to: "/login" });
    },
  });

  return {
    user,
    isAuthenticated,
    googleLogin: authApi.googleSign,
    logout: () => logout.mutate(),
    isLoggingOut: logout.isPending,
  };
}
