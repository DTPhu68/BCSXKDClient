export interface DevLoginRole {
  roleId: string;
  roleName: string;
}

export interface DevLoginKhoi {
  khoiId: number;
  khoiName: string;
}

export interface DevLoginUser {
  userName: string;
  fullName: string;
  roleId: string;
  roleName: string;
  khoiId: number;
  khoiName: string;
}