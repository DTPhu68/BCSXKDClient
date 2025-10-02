import { SaveYearItem } from './save-year-item.model';

export interface SaveYearRequest {
  headerId: number;
  yearItems: SaveYearItem[];
}
