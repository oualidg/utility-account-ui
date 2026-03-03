import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Add withCredentials to all requests so cookies are sent automatically
  const reqWithCredentials = req.clone({ withCredentials: true });

  return next(reqWithCredentials).pipe(
    catchError((error: HttpErrorResponse) => {
      // If 401 on the refresh endpoint itself — session expired, redirect to login
      if (error.status === 401 && req.url.includes('/api/auth/refresh')) {
        authService.currentUser.set(null);
        router.navigate(['/login']);
        return throwError(() => error);
      }

      // If 401 on any other endpoint — try to refresh the access token
      if (error.status === 401) {
        return authService.refresh().pipe(
          switchMap(() => next(reqWithCredentials)),
          catchError(() => {
            authService.currentUser.set(null);
            router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};