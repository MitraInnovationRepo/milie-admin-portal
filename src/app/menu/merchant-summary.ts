import { City } from "app/shared/data/city";
import { MerchantCuisine } from "app/shared/data/merchant-cuisine";

export interface MerchantSummary {
  id: number;
  shopCode: string;
  name: string;
  city: City;
  primaryPhoneNumber: number;
  status: number;
  online: boolean;
  displayCity: string;
  displayStatus: string;
  displayOnline: string;
  shopHistoryId: number;
  shopCuisine: MerchantCuisine[];
  menuUploaded: boolean;
}
