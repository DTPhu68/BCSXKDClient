export interface MockUser {
  userName: string;
  fullUnitName: string;
}
export interface MockKhoiGroup {
  khoiName: string;
  users: MockUser[];
}