import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProviderBreakdown {
  providerCode: string;
  providerName: string;
  totalAmount: number;
  count: number;
}

export interface ReportSummary {
  totalAmount: number;
  totalCount: number;
  byProvider: ProviderBreakdown[];
}

export interface PaymentRecord {
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
export class ReportService {

  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/reports`;

  constructor(private http: HttpClient) { }

  getSummary(from?: string, to?: string): Observable<ReportSummary> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<ReportSummary>(`${this.baseUrl}/summary`, { params });
  }

  getPaymentsByAccount(accountNumber: number, from?: string, to?: string): Observable<PaymentRecord[]> {
    let params = new HttpParams().set('accountNumber', accountNumber);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<PaymentRecord[]>(`${this.baseUrl}/payments`, { params });
  }
}