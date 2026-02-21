import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CustomerSummary {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

export interface CustomerDetailed {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
  accounts: Account[];
}

export interface Account {
  accountNumber: number;
  balance: number;
  isMainAccount: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/customers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CustomerSummary[]> {
    return this.http.get<CustomerSummary[]>(this.baseUrl);
  }

  getById(id: number): Observable<CustomerDetailed> {
    return this.http.get<CustomerDetailed>(`${this.baseUrl}/${id}`);
  }

searchByMobile(mobile: string): Observable<CustomerSummary[]> {
  return this.http.get<CustomerSummary[]>(`${this.baseUrl}/search`, {
    params: new HttpParams().set('mobile', mobile)
  });
}



}