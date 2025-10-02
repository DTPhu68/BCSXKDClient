export interface YearDetail {
  id: number;            // Id của MonthDetail
  chiTieuId: number;
  chiTieuName: string;
  prefix?: string | null;
  displayOrder: number;
  level: number;
  leafNode: boolean;

  planValue: number;  
}