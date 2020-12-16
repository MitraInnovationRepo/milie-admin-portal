import { NumberValueAccessor } from '@angular/forms';

export class PaymentPendingOrder{
    orderNo: string;
    orderDate: Date;
    customerName: string;
    amount: number;
    discount: number;
    netAmount: number;
}