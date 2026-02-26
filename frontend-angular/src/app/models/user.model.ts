export interface User {
  id?: number;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
}
