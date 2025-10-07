export interface ChiTieuRef {
  id: number;
  chiTieuName: string;
}

export interface Target {
  id: number;
  khoiId: number;
  chiTieuId: number;
  chiTieuName: string;
  prefix?: string;
  displayOrder: number;
  level: number;
  leafNode: boolean;
  isActive: boolean;
  addFromList: ChiTieuRef[];
}