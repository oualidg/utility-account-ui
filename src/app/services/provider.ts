import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Provider {
  id: number;
  code: string;
  name: string;
  apiKeyPrefix: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderCreated {
  id: number;
  code: string;
  name: string;
  apiKeyPrefix: string;
  active: boolean;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderRequest {
  code: string;
  name: string;
}

export interface UpdateProviderRequest {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/providers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Provider[]> {
    return this.http.get<Provider[]>(this.baseUrl);
  }

  getById(id: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateProviderRequest): Observable<ProviderCreated> {
    return this.http.post<ProviderCreated>(this.baseUrl, request);
  }

  update(id: number, request: UpdateProviderRequest): Observable<Provider> {
    return this.http.patch<Provider>(`${this.baseUrl}/${id}`, request);
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  reactivate(id: number): Observable<Provider> {
    return this.http.post<Provider>(`${this.baseUrl}/${id}/reactivate`, {});
  }

  regenerateKey(id: number): Observable<ProviderCreated> {
    return this.http.post<ProviderCreated>(`${this.baseUrl}/${id}/regenerate-key`, {});
  }
}