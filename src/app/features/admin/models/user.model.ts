export interface UserList {
  userId: number;
  userName: string;
  fullName: string;
  donViId: number; 
  donViName: string;
  isActive: boolean;
  searchName: string;
  roles: string[];
  rolesString: string;
}

export interface SaveUser {
  userId?: number;       // optional
  userName: string;
  fullName: string;
  searchName: string;
  donViId: number;
  roleIds: string[];
  isActive: boolean;
}