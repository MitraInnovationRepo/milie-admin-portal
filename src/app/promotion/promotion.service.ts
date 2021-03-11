import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Promotion } from './promotion';

const API_URL = environment.API_URL;

@Injectable()
export class PromotionService{
    constructor(
        private http: HttpClient
    ) { }

    getPromotions() {
        const url = API_URL + '/promotions';
        return this.http.get<Promotion[]>(url);
    }

    getMerchantPromotions() {
        const url = API_URL + '/shop-promotion/get-all-deals';
        return this.http.get<Promotion[]>(url);
    }

    getPromotion(id){
        const url = API_URL + `/promotions/${id}`;
        return this.http.get<Promotion>(url);
    }

    getPromotionMerchants(id){
        const url = API_URL + `/shop-promotion/get-deal-merchants/${id}`;
        return this.http.get(url);
    }

    getPromotionMerchantsDifferenece(id){
        const url = API_URL + `/shop-promotion/get-deal-merchants-difference/${id}`;
        return this.http.get(url);
    }

    getAllMerchants(){
        const url = API_URL + `/shops/all`;
        return this.http.get(url);
    }

    addPromotion(promotion){
        const url = API_URL + `/promotions`;
        return this.http.post(url, promotion);
    }

    addMerchantPromotion(promotion){
        const url = API_URL + `/shop-promotion/promotion-template`;
        return this.http.post(url, promotion);
    }

    updateMerchantPromotion(promotion){
        const url = API_URL + `/shop-promotion/promotion-template`;
        return this.http.put(url, promotion);
    }

    deletePromotion(id){
        const url = API_URL + `/promotions/${id}`;
        return this.http.delete(url);
    }

    deleteMerchantPromotion(id){
        const url = API_URL + `/shop-promotion/${id}`;
        return this.http.delete(url);
    }

}

