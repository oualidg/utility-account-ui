import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Generic Spring Page wrapper — matches the JSON structure returned by
// all paginated endpoints: { content, totalElements, totalPages, number, size }
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

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

  /**
   * Get a paginated list of all customers.
   * Default sort: createdAt descending (newest first).
   */
  getAll(page = 0, size = 10): Observable<Page<CustomerSummary>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');
    return this.http.get<Page<CustomerSummary>>(this.baseUrl, { params });
  }

  /**
   * Get customer by ID — navigates to detail page, no pagination needed.
   */
  getById(id: number): Observable<CustomerDetailed> {
    return this.http.get<CustomerDetailed>(`${this.baseUrl}/${id}`);
  }

  /**
   * Search customers by mobile number fragment.
   */
  searchByMobile(mobile: string, page = 0, size = 10): Observable<Page<CustomerSummary>> {
    const params = new HttpParams()
      .set('type', 'mobile')
      .set('value', mobile)
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');
    return this.http.get<Page<CustomerSummary>>(`${this.baseUrl}/search`, { params });
  }

  /**
   * Search customers by surname fragment (case-insensitive).
   */
  searchBySurname(surname: string, page = 0, size = 10): Observable<Page<CustomerSummary>> {
    const params = new HttpParams()
      .set('type', 'surname')
      .set('value', surname)
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');
    return this.http.get<Page<CustomerSummary>>(`${this.baseUrl}/search`, { params });
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