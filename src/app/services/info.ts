import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppInfo {
  app?: {
    name?: string;
    version?: string;
    author?: string;
    contact?: {
      email?: string;
      github?: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  private readonly url = `${environment.apiBaseUrl}/api/info`;

  constructor(private http: HttpClient) {}

  getInfo(): Observable<AppInfo> {
    return this.http.get<AppInfo>(this.url);
  }
}