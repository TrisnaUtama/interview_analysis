export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean
  message: string
  data: User
}
