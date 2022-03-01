import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { MerchantSummary } from "./merchant-summary";
import { Merchant } from "app/shared/data/merchant";
import { ProductType } from "./Product-type";
import { Product } from "./Product";
import { Observable } from "rxjs";

const API_URL = environment.API_URL;

@Injectable()
export class MenuService {
  constructor(private http: HttpClient) {}

  getMerchants(districtId) {
    const url = API_URL + `/shops/all/menu/${districtId}`;
    return this.http.get<MerchantSummary[]>(url);
  }

  getShop(id) {
    const url = API_URL + `/shops/all/${id}`;
    return this.http.get<Merchant>(url);
  }

  getProductTypeList(id) {
    const url = API_URL + `/product-type/shop/${id}`;
    return this.http.get<ProductType[]>(url);
  }

  getMainProductTypes(): Observable<any> {
    const url = API_URL + "/product-type/main";
    return this.http.get<any>(url);
  }

  getCategoryById(id) {
    const url = API_URL + "/product-type/" + id;
    return this.http.get<ProductType>(url);
  }

  saveCategory(shopId, productType) {
    const url = API_URL + `/product-type/${shopId}`;
    return this.http.post<ProductType>(url, productType);
  }

  updateCategory(shopId, productType) {
    const url = API_URL + `/product-type/${shopId}`;
    return this.http.put<ProductType>(url, productType);
  }

  deleteCategory(id: number) {
    const url = API_URL + "/product-type/admin/" + id;
    return this.http.delete<any>(url);
  }

  updateMenuHours(id, workingHourList) {
    const url = API_URL + `/shops/working-hour/${id}`;
    return this.http.put(url, workingHourList);
  }

  getProductById(id: number): Observable<any> {
    const url = API_URL + "/product/" + id;
    return this.http.get<any>(url);
  }

  saveProduct(product: any): Observable<any> {
    const url = API_URL + "/product";
    return this.http.post<any>(url, product);
  }

  updateProduct(product: any): Observable<any> {
    const url = API_URL + "/product";
    return this.http.put<any>(url, product);
  }

  deleteProduct(id: number): Observable<any> {
    const url = API_URL + "/product/" + id;
    return this.http.delete<any>(url);
  }

  getAllShopProducts(id) {
    console.log(id);
    const url = API_URL + `/product/shop/admin/${id}`;
    return this.http.get<Product[]>(url);
  }
}
