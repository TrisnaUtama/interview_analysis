// guard.ts
import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";

export async function guardAuth() {
  // Tunggu rehydration selesai dulu
  await new Promise<void>((resolve) => {
    const store = useAuthStore;
    if (!store.persist.hasHydrated()) {
      const unsub = store.persist.onFinishHydration(() => {
        unsub();
        resolve();
      });
    } else {
      resolve();
    }
  });

  const { isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }
}

export async function guardGuest() {
  await new Promise<void>((resolve) => {
    const store = useAuthStore;
    if (!store.persist.hasHydrated()) {
      const unsub = store.persist.onFinishHydration(() => {
        unsub();
        resolve();
      });
    } else {
      resolve();
    }
  });

  const { isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated) {
    throw redirect({ to: "/dashboard" });
  }
}
