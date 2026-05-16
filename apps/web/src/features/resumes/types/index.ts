export interface ResumeEducation {
  field: string;
  degree: string;
  end_date: string;
  start_date: string;
  institution: string;
}

export interface ResumeExperience {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

export interface ResumeLanguage {
  language: string;
  proficiency: string;
}

export interface ResumeParsedData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  education: ResumeEducation[];
  experience: ResumeExperience[];
  languages: ResumeLanguage[];
  certifications: string[];
  total_years_experience: number;
}

export type ResumeAnalysisStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface Resume {
  id: string;
  user_id: string;
  file_url: string;
  raw_text: string;
  parsed_data: string;
  analysis_status: ResumeAnalysisStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export function getParsedData(resume: Resume): ResumeParsedData | null {
  try {
    return JSON.parse(resume.parsed_data) as ResumeParsedData;
  } catch {
    return null;
  }
}

export interface UploadResumeRequest {
  file: File;
}

import type {
  ApiListResponse,
  ApiDetailResponse,
  ApiEmptyResponse,
} from "@/types/api.type";

export type GetAllResumesResponse = ApiListResponse<Resume>;
export type GetOneResumeResponse = ApiDetailResponse<Resume>;
export type UploadResumeResponse = ApiDetailResponse<Resume>;
export type DeleteResumeResponse = ApiEmptyResponse;
