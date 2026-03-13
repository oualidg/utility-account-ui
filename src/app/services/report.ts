import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Page } from './customer';

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

export interface ProviderSummary {
  providerCode: string;
  providerName: string;
  totalAmount: number;
  totalCount: number;
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

export interface ProviderReconciliation {
  providerCode: string;
  providerName: string;
  totalAmount: number;
  totalCount: number;
  payments: PaymentRecord[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/reports`;

  constructor(private http: HttpClient) { }

  /**
   * Dashboard summary — totals and per-provider breakdown.
   */
  getSummary(from?: string, to?: string): Observable<ReportSummary> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to)   params = params.set('to', to);
    return this.http.get<ReportSummary>(`${this.baseUrl}/summary`, { params });
  }

  /**
   * Lightweight provider summary — totalCount and totalAmount only.
   * Used by the provider detail page Load button.
   */
  getProviderSummary(providerCode: string, from?: string, to?: string): Observable<ProviderSummary> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to)   params = params.set('to', to);
    return this.http.get<ProviderSummary>(
      `${this.baseUrl}/providers/${providerCode}/summary`, { params }
    );
  }

  /**
   * Search payments within a provider and date range, paginated.
   * Used by the provider detail page search box.
   */
  searchProviderPayments(
    providerCode: string,
    accountNumber?: number,
    receiptFragment?: string,
    from?: string,
    to?: string,
    page = 0,
    size = 10
  ): Observable<Page<PaymentRecord>> {
    let params = new HttpParams()
      .set('providerCode', providerCode)
      .set('page', page)
      .set('size', size);
    if (accountNumber)   params = params.set('accountNumber', accountNumber);
    if (receiptFragment) params = params.set('receiptNumber', receiptFragment);
    if (from)            params = params.set('from', from);
    if (to)              params = params.set('to', to);
    return this.http.get<Page<PaymentRecord>>(`${this.baseUrl}/payments`, { params });
  }

  /**
   * Full provider reconciliation — all payments for the period.
   * Used exclusively for CSV export — intentionally unbounded.
   */
  getReconciliation(providerCode: string, from?: string, to?: string): Observable<ProviderReconciliation> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to)   params = params.set('to', to);
    return this.http.get<ProviderReconciliation>(
      `${this.baseUrl}/providers/${providerCode}/reconciliation`, { params }
    );
  }

  /**
   * Paginated payment history for a specific account.
   * Used by the account-payments component.
   */
  getAccountPayments(
    accountNumber: number,
    from?: string,
    to?: string,
    page = 0,
    size = 10
  ): Observable<Page<PaymentRecord>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (from) params = params.set('from', from);
    if (to)   params = params.set('to', to);
    params = params.set('accountNumber', accountNumber);
    return this.http.get<Page<PaymentRecord>>(`${this.baseUrl}/payments`, { params });
  }
}