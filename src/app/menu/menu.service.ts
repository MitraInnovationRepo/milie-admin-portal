import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { MerchantSummary } from "./merchant-summary";
import { Merchant } from "app/shared/data/merchant";

const API_URL = environment.API_URL;

@Injectable()
export class MenuService {
  constructor(private http: HttpClient) {}

  getMerchants(districtId) {
    const url = API_URL + `/shops/all/menu/${districtId}`;
    return this.http.get<MerchantSummary[]>(url);
  }

  getShop(id){
    const url = API_URL + `/shops/all/${id}`;
    return this.http.get<Merchant>(url);
}
}
