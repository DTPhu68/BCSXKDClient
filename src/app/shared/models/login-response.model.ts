// src/app/shared/models/login-response.model.ts
import { AuthUser } from "./auth-user.model";

export interface LoginResponse {
  user: AuthUser;
  token: string;  
}