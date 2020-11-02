import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Auth } from 'app/shared/data/auth';
import { Observable } from 'rxjs';
import { IdentityUser } from 'app/core/user/identity_user';
import { Router } from '@angular/router';

const AUTH_URL = environment.AUTH_URL
const REALM = environment.REALM;

@Injectable({
    providedIn: 'root'
})
export class AuthenitcationService {

    constructor(
        private http: HttpClient, private router: Router) { }

    login(credentials): Observable<Auth> {
        let params = new URLSearchParams();
        params.append('username', credentials.username);
        params.append('password', credentials.password);
        params.append('grant_type', 'password');
        params.append('scopes', 'offline_access');
        let headers =
            new HttpHeaders({
                'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': 'Basic ' + btoa(`${environment.CLIENT_ID}:${environment.CLIENT_SECRET}`),
                'login': 'true'
            });
        const url = AUTH_URL + `/realms/${REALM}/protocol/openid-connect/token`;
        return this.http.post<Auth>(url, params.toString(), { headers });
    }

    fetchUserInfo() {
        return this.http.get<IdentityUser>(`/auth/realms/${REALM}/protocol/openid-connect/userinfo`);
    }

    refreshToken(){
        let params = new URLSearchParams();
        var refreshToken = localStorage.getItem("refresh_token");
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refreshToken);
        params.append('scopes', 'offline_access');
        let headers =
            new HttpHeaders({
                'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': 'Basic ' + btoa(`${environment.CLIENT_ID}:${environment.CLIENT_SECRET}`),
                'login': 'true'
            });
        const url = AUTH_URL + `/realms/${REALM}/protocol/openid-connect/token`;
        return this.http.post<Auth>(url, params.toString(), { headers });
    }

    logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.clear();
        this.router.navigateByUrl("/auth");
    }
}
