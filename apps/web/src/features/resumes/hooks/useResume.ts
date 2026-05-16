import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "@/features/resumes/api/resume.api";
import { getParsedData } from "@/features/resumes/types/index";

export const resumeKeys = {
  all: ["resumes"] as const,
  lists: (params?: { page?: number; limit?: number }) =>
    [...resumeKeys.all, "list", params] as const,
  detail: (id: string) => [...resumeKeys.all, "detail", id] as const,
};

//GET /resumes
export function useGetAllResumes(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: resumeKeys.lists(params),

    queryFn: () =>
      resumeApi.get_all({
        page: params?.page,
        limit: params?.limit,
      }),

    select: (response) => ({
      items: response.data.items,
      meta: response.data.meta,
    }),
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
      return {
        ...resume,
        parsedData: getParsedData(resume),
      };
    },
  });
}

// POST /resumes
export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => resumeApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

/** DELETE /resume/:id */
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
