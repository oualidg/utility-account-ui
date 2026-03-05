import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(cloneWithCsrf(req)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && req.url.includes('/api/auth/refresh')) {
        authService.currentUser.set(null);
        router.navigate(['/login']);
        return throwError(() => error);
      }

      if (error.status === 401) {
        return authService.refresh().pipe(
          switchMap(() => next(cloneWithCsrf(req))),
          catchError(() => {
            authService.currentUser.set(null);
            router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }

      // On 403, XSRF token may have been rotated by Spring after a previous
      // response — retry once with freshly read cookie, then propagate whatever
      // the retry returns (including validation errors like 409)
      if (error.status === 403) {
        return next(cloneWithCsrf(req)).pipe(
          catchError((retryError: HttpErrorResponse) => throwError(() => retryError))
        );
      }

      return throwError(() => error);
    })
  );
};

function cloneWithCsrf(req: HttpRequest<unknown>): HttpRequest<unknown> {
  const xsrfToken = getCookie('XSRF-TOKEN');
  const stateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  return req.clone({
    withCredentials: true,
    headers: xsrfToken && stateChanging
      ? req.headers.set('X-XSRF-TOKEN', xsrfToken)
      : req.headers
  });
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}