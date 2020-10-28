import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { User } from 'app/shared/data/user';
import { ApiResponse } from 'app/shared/data/api-response';

const API_URL = environment.API_URL;

@Injectable()
export class UserService{
    constructor(
        private http: HttpClient
    ) { }

    getUserByPhoneNumber(phoneNumber){
        const url = API_URL + `/users/find/${phoneNumber}`;
        return this.http.get<User>(url);
    }

    initializeUser(user){
        const url = API_URL + `/users/shop`;
        return this.http.post<ApiResponse>(url, user);
    }
}