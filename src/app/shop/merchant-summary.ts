import { City } from "app/shared/data/city";

export interface MerchantSummary{
    id : number,
    shopCode : string,
    name : string, 
    city : City,
    primaryPhoneNumber :number,
    status : number,
    online : boolean,
    displayCity : string,
    displayStatus : string,
    displayOnline : string,
}