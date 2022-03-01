import { ProductType } from './product-type';
import { Merchant } from 'app/shared/data/merchant';


export interface Product {
    id: number,
    productType: ProductType
    shop: Merchant,
    productUnit: number,
    title: string,
    unitPrice: number,
    minOrderQuantity: number,
    maxOrderQuantity: number,
    description: string,
    imageUrl: string,
    status: number,
    unitSize: number,
    isAdded:boolean,
    lastModifiedDate: string
}