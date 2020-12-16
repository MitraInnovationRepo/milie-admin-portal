import { Injectable } from '@angular/core';
import { PendingPayment } from './pending-payment';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ShopAccount } from './shop-account';
import { PaymentPendingOrder } from './payment-pending-order';

const API_URL = environment.API_URL;

@Injectable()
export class PaymentService{
    constructor(
        private http: HttpClient
    ) { }
    
    getPendingPayments() {
        const url = API_URL + '/shop-payment';
        return this.http.get<PendingPayment[]>(url);
    }

    getPaymentPendingOrders(shopId) {
        const url = `${API_URL}/orders/payment/pending/${shopId}`;
        return this.http.get<PaymentPendingOrder[]>(url);
    }

    getShopAccounts(id){
        const url = `${API_URL}/shops/accounts/${id}`;
        return this.http.get<ShopAccount>(url);
    }

}