export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: ApiError[] | null;
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

export type ApiListResponse<T> = ApiResponse<PaginatedData<T>>;
export type ApiDetailResponse<T> = ApiResponse<T>;
export type ApiEmptyResponse = ApiResponse<null>;
