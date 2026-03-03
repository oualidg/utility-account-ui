import { inject } from '@angular/core';
import { AuthService } from './services/auth';
import { catchError, of } from 'rxjs';

export function authInitializer() {
  const authService = inject(AuthService);
  return authService.me().pipe(
    catchError(() => of(null))
  );
}