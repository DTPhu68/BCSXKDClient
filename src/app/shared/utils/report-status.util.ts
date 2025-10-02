import { ReportStatus } from "../models";

export function getReportStatusText(status?: number): string {
  switch (status) {
    case ReportStatus.New:    return 'Mới tạo';
    case ReportStatus.Draft:  return 'Đang nhập';
    case ReportStatus.Locked: return 'Đã khóa';
    default:                  return 'Không rõ';
  }
}