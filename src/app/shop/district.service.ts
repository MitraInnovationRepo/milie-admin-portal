import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from 'app/shared/data/city';
import { District } from 'app/shared/data/district';
import { environment } from 'environments/environment';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  constructor(
    private http: HttpClient
  ) { }

  getDistricts() {
    const url = API_URL + '/provincial/district';
    return this.http.get<District[]>(url);
  }

  getCityByDistrict(id) {
    const url = API_URL + `/provincial/city/district/${id}`;
    return this.http.get<City[]>(url);
  }
}
