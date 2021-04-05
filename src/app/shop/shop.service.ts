import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShopSummary } from './shop-summary';
import { environment } from 'environments/environment';
import { Shop } from './shop';
import { ShopType } from './shop-type';
import { Merchant } from 'app/shared/data/merchant';
import { MerchantSummary } from './merchant-summary';

const API_URL = environment.API_URL;

@Injectable()
export class ShopService{
    constructor(
        private http: HttpClient
    ) { }

    getShops(){
        const url = API_URL + '/shops/all';
        return this.http.get<ShopSummary[]>(url);
    }

    getMerchants(){
        const url = API_URL + '/shops/all';
        return this.http.get<MerchantSummary[]>(url);
    }

    
    getMerchantsByCity(id){
        const url = API_URL + `/shops/all/city/${id}`;
        return this.http.get<MerchantSummary[]>(url);
    }

    getShopType(){
        const url = API_URL + '/shop-types';
        return this.http.get<ShopType[]>(url);
    }

    getShop(id){
        console.log(id);
        const url = API_URL + `/shops/all/${id}`;
        return this.http.get<Merchant>(url);
    }

    createShop(shop){
        const url = API_URL + `/shops`;
        return this.http.post(url, shop);
    }

    updateShop(shop){
        const url = API_URL + `/shops/admin`;
        return this.http.put(url, shop);
    }

    approveShop(id){
        const url = API_URL + `/shops/approve/${id}`;
        return this.http.put(url,id);
    }

    rejectShop(id){
        const url = API_URL + `/shops/reject/${id}`;
        return this.http.put(url,id);
    }

    publishShop(id){
        const url = API_URL + `/shops/publish/${id}`;
        return this.http.put(url,id);
    }

    unpublish(id){
        const url = API_URL + `/shops/unpublish/${id}`;
        return this.http.put(url,id);
    }
}