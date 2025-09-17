// src/app/shared/models/auth-user.model.ts
export interface AuthUser {
  userId: number;
  userName: string;
  fullName: string;
  khoiId: number;  
  roles: string[];
}