import { ENDPOINTS } from "@/constants/endpoints";
import { api } from "@/lib/axios";
import type {
  GetOneResumeResponse,
  UploadResumeResponse,
  DeleteResumeResponse,
} from "../types/index";

export const resumeApi = {
  get_all: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/resumes", {
      params,
    });

    return response.data;
  },

  get_one: async (id: string): Promise<GetOneResumeResponse> => {
    const endpoint = ENDPOINTS.RESUME.get_one.replace("{id}", id);
    const res = await api.get<GetOneResumeResponse>(endpoint);
    return res.data;
  },

  upload: async (file: File): Promise<UploadResumeResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<UploadResumeResponse>(
      ENDPOINTS.RESUME.upload,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data;
  },

  delete: async (id: string): Promise<DeleteResumeResponse> => {
    const endpoint = ENDPOINTS.RESUME.delete.replace("{id}", id);
    const res = await api.delete<DeleteResumeResponse>(endpoint);
    return res.data;
  },
};
