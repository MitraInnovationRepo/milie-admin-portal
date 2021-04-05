import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthenitcationService } from '../service/authenitcation.service';
import { P } from '@angular/cdk/keycodes';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router, private authenticationService: AuthenitcationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.headers.get('login')) {
            return next.handle(request);
        }
        const token = localStorage.getItem('access_token');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
            return next.handle(request)
                .pipe(
                    catchError(
                        (err, caught) => {
                            if (err.status === 401) {
                                const refreshToken = localStorage.getItem('refresh_token');
                                if (refreshToken) {
                                    this.authenticationService.refreshToken()
                                        .subscribe(
                                            result => {
                                                localStorage.setItem("access_token", result.access_token);
                                                localStorage.setItem("refresh_token", result.refresh_token);
                                                request = request.clone({
                                                    setHeaders: {
                                                        Authorization: 'Bearer ' + token
                                                    }
                                                });
                                                return next.handle(request);
                                            },
                                            error => {
                                                this.authenticationService.logout();
                                            }
                                        );
                                }
                                else {
                                    this.authenticationService.logout();
                                }
                            }
                            throw err;
                        }
                    )
                );
        }
        else {
            this.authenticationService.logout();
        }
    }
}
