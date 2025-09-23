import { ChiTieuKhoiAddTo } from "./chi-tieu-khoi-add-to.model";
import { MonthDetail } from "./month-detail.model";

export interface MonthResponse {
  headerId: number;
  donViId: number;
  donViName: string;
  nam: number;
  thang: number;

  status: number; // có thể map với ReportStatus enum
  monthItems: MonthDetail[];
  chiTieuKhoiAddTos: ChiTieuKhoiAddTo[];
}