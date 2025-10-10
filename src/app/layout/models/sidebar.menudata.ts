// src/app/layout/models/sidebar.menudata.ts
import { SidebarMenuItem } from './sidebar-menu-item.model';

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'fas fa-home',
    children: [
      {
        label: 'Trang chính',
        icon: 'fas fa-tachometer-alt',
        routerLink: '/',
        roles: ['Admin', 'NhapLieu', 'BaoCao','ToanNganh'], // các role được phép truy cập
        exact: true,
      },
    ],
  },
   {
    key: 'admin',
    label: 'Quản trị',
    icon: 'fas fa-users-cog',
    khoiId: 0,
    children: [
      { label: 'Người dùng', icon: 'fas fa-user-friends', routerLink: '/admin/users',roles:['Admin'] },
      { label: 'Đơn vị', icon: 'fas fa-building', routerLink: '/admin/units',roles:['Admin'] },
      { label: 'Chỉ tiêu', icon: 'fas fa-chart-bar', routerLink: '/admin/targets',roles:['Admin'] },
    ],
  },
  {
    key: 'toannganh',
    label: 'Toàn ngành',
    icon: 'fas fa-sitemap',
    khoiId: 0,
    children: [
      { label: 'Toàn ngành', icon: 'fas fa-calendar-alt', routerLink: '/toan-nganh',roles:['ToanNganh'] },
      { label: 'Kiểm tra tháng', icon: 'fas fa-calendar', routerLink: '/toan-nganh/month-check',roles:['ToanNganh'] },
      { label: 'Kiểm tra năm', icon: 'fas fa-chart-bar', routerLink: '/toan-nganh/year-check',roles:['ToanNganh'] },
    ],
  },
  {
    key: 'cophan',
    label: 'Cổ phần ĐS',
    icon: 'fas fa-train',
    khoiId: 2,
    children: [
     { label: 'Kế hoạch tháng', icon: 'fas fa-calendar-alt', routerLink: '/month-entries',roles:['NhapLieu'] },
      { label: 'Kế hoạch năm', icon: 'fas fa-calendar', routerLink: '/year-entries',roles:['NhapLieu'] },
      { label: 'Báo cáo', icon: 'fas fa-chart-bar', routerLink: '/report',roles:['BaoCao'] },
    ],
  },
  {
    key: 'congnghiep',
    label: 'Khối công nghiệp',
    icon: 'fas fa-industry',
    khoiId: 4,
    children: [
      { label: 'Kế hoạch tháng', icon: 'fas fa-calendar-alt', routerLink: '/month-entries',roles:['NhapLieu'] },
      { label: 'Kế hoạch năm', icon: 'fas fa-calendar', routerLink: '/year-entries',roles:['NhapLieu'] },
      { label: 'Báo cáo', icon: 'fas fa-chart-bar', routerLink: '/report',roles:['BaoCao'] },
    ],
  },
  {
    key: 'khaithac',
    label: 'Chi nhánh KT & ĐM',
    icon: 'fas fa-road',
    khoiId: 8,
   children: [
      { label: 'Kế hoạch tháng', icon: 'fas fa-calendar-alt', routerLink: '/month-entries',roles:['NhapLieu'] },
      { label: 'Kế hoạch năm', icon: 'fas fa-calendar', routerLink: '/year-entries',roles:['NhapLieu'] },
      { label: 'Báo cáo', icon: 'fas fa-chart-bar', routerLink: '/report',roles:['BaoCao'] },
    ],
  },
  {
    key: 'ttth',
    label: 'Thông tin tín hiệu',
    icon: 'fas fa-traffic-light',
      khoiId: 9,
    children: [
     { label: 'Kế hoạch tháng', icon: 'fas fa-calendar-alt', routerLink: '/month-entries',roles:['NhapLieu'] },
      { label: 'Kế hoạch năm', icon: 'fas fa-calendar', routerLink: '/year-entries',roles:['NhapLieu'] },
      { label: 'Báo cáo', icon: 'fas fa-chart-bar', routerLink: '/report',roles:['BaoCao'] },
    ],
  },
];
