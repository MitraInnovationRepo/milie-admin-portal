import { ShopType } from "app/shop/shop-type";
import { Address } from "./address";
import { Bank } from "./bank";
import { Branch } from "./branch";
import { City } from "./city";
import { ContactactPerson } from "./contact-person";
import { District } from "./district";
import { DocumentDetails } from "./document-details";
import { MerchantCuisine } from "./merchant-cuisine";
import { ResturantHours } from "./resturent-hours";
import { User } from "./user";

export interface Merchant{
    id:number,
    name : string;
    shopCode:string;
    status:number;
    businessRegistrationNumber:String;
    address : Address;
    city : City;
    district : District;
    location:string;
    secondaryPhoneNumber:number;
    primaryPhoneNumber:number;
    email:string;
    imageName:string;
    shopType:ShopType[];
    priceRange:string;
    commission:number;
    latitude:number;
    longitude:number;
    minimumOrderAmount:number;
    preparationTime:number;
    accountName:string;
    accountNumber:number;
    accountPassbookImage:string;
    bank:Bank;
    branch:Branch;
    accountManager:User;
    contactList:ContactactPerson[];
    workingHourList:ResturantHours[];
    documentList:DocumentDetails[];
    shopCuisine : MerchantCuisine[];
}