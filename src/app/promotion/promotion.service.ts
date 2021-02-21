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

    getAllMerchants(){
        const url = API_URL + `/shops/all`;
        return this.http.get(url);
    }

    addPromotion(promotion){
        const url = API_URL + `/promotions`;
        return this.http.post(url, promotion);
    }

    addMerchantPromotion(promotion){
        const url = API_URL + `/shop-promotion`;
        return this.http.post(url, promotion);
    }

    deletePromotion(id){
        const url = API_URL + `/promotions/${id}`;
        return this.http.delete(url);
    }

}

