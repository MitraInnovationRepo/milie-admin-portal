import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


let headers: HttpHeaders = new HttpHeaders();
headers = headers.append('Accept', 'application/json;charset=UTF-8');
const httpOptions = {
  headers: headers
};

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient,
  ) { }

  uploadFile(file): Observable<any> {
    const url = API_URL + '/file/upload';
    return this.http.post(url, file, { responseType: 'text' }).pipe()
  }

  getFileUrl(fileName: string): Observable<any> {
    const url = API_URL + '/file/download/' + fileName;
    return this.http.get(url, { responseType: 'blob' })
  }
}
