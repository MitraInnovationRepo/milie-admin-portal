import { User } from "app/shared/data/user";
import { ShopType } from './shop-type';
import { Address } from 'app/shared/data/address';

export interface Shop {
    user: User;
    address: Address;
    id: number;
    name: String;
    slogan: String;
    displayCity: String;
    shopType: ShopType;
    longitude: number;
    latitude: number;
    imageName: String;
    description: String;
    secondaryPhoneNumber: String;
    minimumOrderAmount: number;
    status: number;
    openingHour: number;
    closingHour: number;
    maxDeliveryDistance: number;
    priceRange: String;
    bank: String;
    branch: String;
    accountNumber: String;
    commission: number;
    primaryPhoneNumber: String;
}