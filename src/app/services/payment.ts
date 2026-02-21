import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentSummary {
  receiptNumber: string;
  amount: number;
  paymentDate: string;
  providerCode: string;
  providerName: string;
  accountNumber: number;
  customerId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/payments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PaymentSummary[]> {
    return this.http.get<PaymentSummary[]>(this.baseUrl);
  }
}