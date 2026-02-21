import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Payment {
  receiptNumber: string;
  amount: number;
  paymentDate: string;
  providerCode: string;
  providerName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/accounts`;

  constructor(private http: HttpClient) {}

  getPayments(accountNumber: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/${accountNumber}/payments`);
  }
}