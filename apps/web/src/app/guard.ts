import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";

export function guardAuth() {
  const { isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }
}

export function guardGuest() {
  const { isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated) {
    throw redirect({ to: "/dashboard" });
  }
}
