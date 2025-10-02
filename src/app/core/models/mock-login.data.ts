import { MockKhoiGroup } from './mock-login.model';

export const MOCK_LOGIN_DATA: MockKhoiGroup[] = [
  {
    khoiName: 'Toàn ngành',
    users: [
      { userName: 'tctds', fullUnitName: 'TCT Đường sắt' },      
    ],
  },
  {
    khoiName: 'Cổ phần Đường sắt',
    users: [
      { userName: 'ctcpdshh', fullUnitName: 'Cty CP đường sắt Hà Hải' },
      { userName: 'ctcpdssg', fullUnitName: 'Xí nghiệp Thông tin Viễn thông' },
    ],
  },
  {
    khoiName: 'Khối Công nghiệp',
    users: [
      { userName: 'ctcpxlgl', fullUnitName: 'Công ty CP Xe lửa Gia Lâm' },
      { userName: 'ctcpddm', fullUnitName: 'Cty CP Đá Đồng Mỏ' },
    ],
  },
  {
    khoiName: 'Chi nhánh KT + ĐM',
    users: [
      { userName: 'xndmhn', fullUnitName: 'XNĐM Hà Nội' },
      { userName: 'cnktdshn', fullUnitName: 'Chi nhánh khai thác ĐS Hà Nội' },
    ],
  },
  {
    khoiName: 'Thông tin tín hiệu',
    users: [
      { userName: 'ctcpttthdshn', fullUnitName: 'Cty CP TTTHĐS Hà Nội' },
      { userName: 'ctcpttthdssg', fullUnitName: 'Cty CP TTTHĐS Sài Gòn' },
    ],
  }
];
