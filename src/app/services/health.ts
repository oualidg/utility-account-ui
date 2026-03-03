import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HealthStatus {
  status: string;
  components?: {
    [key: string]: {
      status: string;
      details?: { [key: string]: any };
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  private readonly url = `${environment.apiBaseUrl}/api/health`;

  constructor(private http: HttpClient) {}

  getHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(this.url);
  }
}