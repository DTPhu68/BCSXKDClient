// src/app/shared/models/login-request.model.ts
export interface LoginRequest {
  userName: string;
  password: string;
  remember?: boolean;
} 