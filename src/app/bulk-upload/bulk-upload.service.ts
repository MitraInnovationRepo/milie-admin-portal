import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = environment.API_URL;

@Injectable()
export class BulkUploadService {
    constructor(
        private http: HttpClient
    ) { }

    uploadProductType(shopId, file) {
        const formData = new FormData();
        formData.append('file', file);
        const url = API_URL + `/bulk/product-type/${shopId}`;
        return this.http.post(url, formData);
    }

    uploadProduct(shopId, file) {
        const formData = new FormData();
        formData.append('file', file);
        const url = API_URL + `/bulk/product/${shopId}`;
        return this.http.post(url, formData);
    }

    getProductTypeCount(shopId){
        const url = API_URL + `/bulk/product-type/${shopId}`;
        return this.http.get(url);
    }

    getProductCount(shopId){
        const url = API_URL + `/bulk/product/${shopId}`;
        return this.http.get(url);
    }
}