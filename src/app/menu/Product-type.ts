import { ResturantHours } from "app/shared/data/resturent-hours";

export interface ProductType {
  id: string;
  name: string;
  image: string;
  description: string;
  sortingId: number;
  menus: string;
  productCount: number;
  availability: boolean;
  lastModifiedDate : string;
  productTypeHourList : ResturantHours[];
}
