export type UserRole = 'STUDENT' | 'TPO' | 'RECRUITER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  is_active: boolean;
  student_id?: number | null;
  full_name?: string | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
