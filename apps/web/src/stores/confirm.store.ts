import { create } from "zustand";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmStore {
  open: boolean;
  options: ConfirmOptions | null;
  isLoading: boolean;
  confirm: (options: ConfirmOptions) => void;
  cancel: () => void;
  setLoading: (loading: boolean) => void;
}

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  open: false,
  options: null,
  isLoading: false,

  confirm: (options) => set({ open: true, options, isLoading: false }),

  cancel: () => {
    get().options?.onCancel?.();
    set({ open: false, options: null, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));

export function useConfirm() {
  const confirm = useConfirmStore((s) => s.confirm);

  return (options: ConfirmOptions) => confirm(options);
}
