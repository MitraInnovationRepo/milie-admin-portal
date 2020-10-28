import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShopSummary } from './shop-summary';
import { environment } from 'environments/environment';
import { Shop } from './shop';
import { ShopType } from './shop-type';

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

    getShopType(){
        const url = API_URL + '/shop-types';
        return this.http.get<ShopType[]>(url);
    }

    getShop(id){
        const url = API_URL + `/shops/all/${id}`;
        return this.http.get<Shop>(url);
    }

    createShop(shop){
        const url = API_URL + `/shops`;
        return this.http.post(url, shop);
    }
}