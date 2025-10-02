
import { ChiTieuKhoiAddTo } from "../chi-tieu-khoi-add-to.model";
import { ReportStatus } from "../report-status.enum";
import { YearDetail } from "./year-detail.model";

export interface YearResponse {
  headerId: number;
  donViId: number;
  donViName: string;
  nam: number;  

  status: ReportStatus; // có thể map với ReportStatus enum
  yearItems: YearDetail[];
  chiTieuKhoiAddTos: ChiTieuKhoiAddTo[];
  
}