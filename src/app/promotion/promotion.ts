import { CustomerPromotion } from './customer-promotion';

export interface Promotion{
    id: number;
    type: number;
    code: String;
    name: String;
    description: String;
    imageUrl: String;
    startDate: Date;
    endDate: Date;
    subType: number;
    discountOption: number;
    applyCount: number;
    discountAmount: number;
    discountPercentage: number;
    status: number;
    registration:number ;
    allCustomer: number;
    minOrderAmount: number;
    maxOrderAmount: number;
    maxDiscountAmount: number;
    customerPromotionList: CustomerPromotion[];
}