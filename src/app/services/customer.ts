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
  updatedAt: string;
  accounts: Account[];
}

export interface Account {
  accountNumber: number;
  balance: number;
  isMainAccount: boolean;
  createdAt: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/customers`;

  constructor(private http: HttpClient) { }

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

  create(request: CreateCustomerRequest): Observable<CustomerDetailed> {
    return this.http.post<CustomerDetailed>(`${this.baseUrl}`, request);
  }

  update(id: number, request: UpdateCustomerRequest): Observable<CustomerDetailed> {
    return this.http.put<CustomerDetailed>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }



}