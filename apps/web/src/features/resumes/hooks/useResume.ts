import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "@/features/resumes/api/resume.api";
import { getParsedData } from "@/features/resumes/types/index";
import { useEffect, useRef } from "react";
import type { Resume } from "../types";

const FINAL_STATUSES = ["completed", "failed"];

export const resumeKeys = {
  all: ["resumes"] as const,
  lists: (params?: { page?: number; limit?: number }) =>
    [...resumeKeys.all, "list", params] as const,
  detail: (id: string) => [...resumeKeys.all, "detail", id] as const,
};

// GET /resumes
export function useGetAllResumes(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: resumeKeys.lists(params),
    queryFn: () =>
      resumeApi.get_all({ page: params?.page, limit: params?.limit }),
    select: (response) => ({
      items: response.data.items,
      meta: response.data.meta,
    }),
    refetchInterval: (query) => {
      const items = query.state.data?.data?.items ?? [];
      const hasPending = items.some(
        (r: Resume) => !FINAL_STATUSES.includes(r.analysis_status),
      );
      console.log("refetchInterval check:", {
        hasPending,
        items: items.map((r: Resume) => ({
          id: r.id,
          status: r.analysis_status,
        })),
      });
      return hasPending ? 3000 : false;
    },
  });
}

// GET /resumes/:id
export function useGetOneResume(id: string) {
  return useQuery({
    queryKey: resumeKeys.detail(id),
    queryFn: () => resumeApi.get_one(id),
    enabled: !!id,
    select: (response) => {
      const resume = response.data;
      return { ...resume, parsedData: getParsedData(resume) };
    },
    refetchInterval: (query) => {
      const status = query.state.data?.data?.analysis_status;
      console.log("detail refetchInterval:", status);
      return status && !FINAL_STATUSES.includes(status) ? 3000 : false;
    },
  });
}

// POST /resumes
export function useUploadResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => resumeApi.upload(file),
    onSuccess: (data) => {
      const newResume = data.data; // sesuaikan dengan struktur response

      // inject dulu ke semua list cache yang ada
      queryClient.setQueriesData({ queryKey: resumeKeys.all }, (old: any) => {
        if (!old?.data?.items) return old;
        return {
          ...old,
          data: {
            ...old.data,
            items: [newResume, ...old.data.items],
            meta: {
              ...old.data.meta,
              total_items: (old.data.meta?.total_items ?? 0) + 1,
            },
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

// DELETE /resumes/:id
export function useDeleteResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumeApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      queryClient.removeQueries({ queryKey: resumeKeys.detail(id) });
    },
  });
}

// SSE stream untuk detail page
export function useResumeStatusStream(
  id: string,
  currentStatus: string | undefined,
) {
  const queryClient = useQueryClient();
  const isFinal = useRef(false);

  useEffect(() => {
    isFinal.current = false;
  }, [id]);

  useEffect(() => {
    if (!id || !currentStatus) return;
    if (FINAL_STATUSES.includes(currentStatus)) return;

    const controller = new AbortController();

    async function connect() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/resumes/${id}/stream`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
          signal: controller.signal,
        });

        if (!res.ok || !res.body) return;
        console.log("SSE connecting for:", id, "status:", currentStatus);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            try {
              const { status } = JSON.parse(line.replace("data:", "").trim());

              queryClient.setQueryData(resumeKeys.detail(id), (old: any) => {
                if (!old) return old;
                return {
                  ...old,
                  data: { ...old.data, analysis_status: status },
                };
              });

              if (FINAL_STATUSES.includes(status)) {
                isFinal.current = true;
                queryClient.invalidateQueries({
                  queryKey: resumeKeys.detail(id),
                });
                queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
                return;
              }
            } catch {}
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("SSE error:", err);
        }
      }
    }

    connect();
    return () => controller.abort();
  }, [id, queryClient]);
}
