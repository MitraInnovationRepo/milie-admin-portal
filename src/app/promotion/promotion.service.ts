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

    getPromotion(id){
        const url = API_URL + `/promotions/${id}`;
        return this.http.get<Promotion>(url);
    }

    addPromotion(promotion){
        const url = API_URL + `/promotions`;
        return this.http.post(url, promotion);
    }

    deletePromotion(id){
        const url = API_URL + `/promotions/${id}`;
        return this.http.delete(url);
    }

}