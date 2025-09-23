import { SaveMonthItem } from "./save-month-item.model";

export interface SaveMonthRequest {
  headerId: number;
  monthItems: SaveMonthItem[];
}