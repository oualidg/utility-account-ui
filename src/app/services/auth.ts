import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface CurrentUser {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = `${environment.apiBaseUrl}/api/auth`;

  currentUser = signal<CurrentUser | null>(null);

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.currentUser.set({
          username: response.username,
          firstName: response.firstName,
          lastName: response.lastName,
          role: response.role
        });
      })
    );
  }

  me(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${this.baseUrl}/me`, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.currentUser.set({
          username: response.username,
          firstName: response.firstName,
          lastName: response.lastName,
          role: response.role
        });
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => this.currentUser.set(null))
    );
  }

  refresh(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/refresh`, {}, {
      withCredentials: true
    });
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ROLE_ADMIN';
  }
}