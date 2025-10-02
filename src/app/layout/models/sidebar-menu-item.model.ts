export interface SidebarMenuItem {
  key: string;          // dùng để toggle
  label: string;        // tên hiển thị
  icon: string;         // icon lớp fontawesome
  khoiId?:number;
  children?: {
    label: string;
    icon: string;
    routerLink: string;
    roles: string[]; // các role được phép truy cập
    exact?: boolean;    // tuỳ chọn: routerLinkActiveOptions.exact
  }[];
}