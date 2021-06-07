import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bank } from 'app/shared/data/bank';
import { Branch } from 'app/shared/data/branch';
import { environment } from 'environments/environment';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(
    private http : HttpClient
  ) { }

  getBanks(){
    const url = API_URL + '/financial-institute/bank'
    return this.http.get<Bank[]>(url);
  }

  getAllBanksByName(bank){
    const url = API_URL + `/financial-institute/bank/${bank}`
    return this.http.get<Bank[]>(url);
  }

  getBranchByBank(id){
    const url = API_URL + `/financial-institute/branch/bank/${id}`
    return this.http.get<Branch[]>(url);
  }
}
