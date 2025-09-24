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
        exact: true,
      },
    ],
  },
  {
    key: 'toannganh',
    label: 'Toàn ngành',
    icon: 'fas fa-sitemap',
    khoiId: 2,
    children: [
      { label: 'Kế hoạch tháng', icon: 'fas fa-calendar-alt', routerLink: '/month-entries' },
      { label: 'Kế hoạch năm', icon: 'fas fa-calendar', routerLink: '/year-entries' },
      { label: 'Báo cáo', icon: 'fas fa-chart-bar', routerLink: '/report' },
    ],
  },
  {
    key: 'cophan',
    label: 'Cổ phần ĐS',
    icon: 'fas fa-train',
    khoiId: 2,
    children: [
      { label: 'Kế hoạch tháng', icon: 'fas fa-calendar-alt', routerLink: '/month-entries' },
      { label: 'Kế hoạch năm', icon: 'fas fa-calendar', routerLink: '/year-entries' },
      { label: 'Báo cáo', icon: 'fas fa-chart-bar', routerLink: '/report' },
    ],
  },
  {
    key: 'congnghiep',
    label: 'Khối công nghiệp',
    icon: 'fas fa-industry',
    khoiId: 4,
    children: [
      { label: 'Kế hoạch tháng', icon: 'fas fa-calendar-alt', routerLink: '/month-entries' },
      { label: 'Kế hoạch năm', icon: 'fas fa-calendar', routerLink: '/year-entries' },
      { label: 'Báo cáo', icon: 'fas fa-chart-bar', routerLink: '/report' },
    ],
  },
  {
    key: 'khaithac',
    label: 'Chi nhánh KT & ĐM',
    icon: 'fas fa-road',
    khoiId: 8,
   children: [
      { label: 'Kế hoạch tháng', icon: 'fas fa-calendar-alt', routerLink: '/month-entries' },
      { label: 'Kế hoạch năm', icon: 'fas fa-calendar', routerLink: '/year-entries' },
      { label: 'Báo cáo', icon: 'fas fa-chart-bar', routerLink: '/report' },
    ],
  },
  {
    key: 'ttth',
    label: 'Thông tin tín hiệu',
    icon: 'fas fa-traffic-light',
    children: [
      { label: 'Kế hoạch tháng', icon: 'fas fa-calendar-alt', routerLink: '/month-entries' },
      { label: 'Kế hoạch năm', icon: 'fas fa-calendar', routerLink: '/year-entries' },
      { label: 'Báo cáo', icon: 'fas fa-chart-bar', routerLink: '/report' },
    ],
  },
];
