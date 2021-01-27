import { Injectable } from '@angular/core';
import { PendingPayment } from './pending-payment';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ShopAccount } from './shop-account';
import { PaymentPendingOrder } from './payment-pending-order';
import { PaymentSummary } from './payment-summary';
import { formatDate } from '@angular/common';

const API_URL = environment.API_URL;

@Injectable()
export class PaymentService {
    constructor(
        private http: HttpClient
    ) { }

    getPendingPayments(date) {
        let formattedDate = formatDate(date, 'yyyy-MM-dd', 'en_US');
        const url = `${API_URL}/shop-payment/pending?date=${formattedDate}`;
        return this.http.get<PendingPayment[]>(url);
    }

    getPaymentHistory(shopId, date) {
        let formattedDate = formatDate(date, 'yyyy-MM-dd', 'en_US');
        console.log('date send: '+ formattedDate);

        const url = `${API_URL}/shop-payment/shop/${shopId}?date=${formattedDate}`;
        return this.http.get<PaymentSummary[]>(url);
    }

    getPaymentPendingOrders(shopId, date) {
        let formattedDate = formatDate(date, 'yyyy-MM-dd', 'en_US');
        const url = `${API_URL}/shop-payment/pending/${shopId}?date=${formattedDate}`;
        return this.http.get<PaymentPendingOrder[]>(url);
    }

    getPaymentPaidOrders(shopId, date) {
        let formattedDate = formatDate(date, 'yyyy-MM-dd', 'en_US');
        const url = `${API_URL}/shop-payment/paid/${shopId}?date=${formattedDate}`;
        return this.http.get<PaymentPendingOrder[]>(url);
    }

    getShopAccounts(id) {
        const url = `${API_URL}/shops/accounts/${id}`;
        return this.http.get<ShopAccount>(url);
    }

    postPayments(paymentRequest) {
        const url = API_URL + '/shop-payment';
        return this.http.post(url, paymentRequest);
    }

}