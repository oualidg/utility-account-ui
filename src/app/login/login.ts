import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, LoginRequest } from '../services/auth';
import { HealthService, HealthStatus } from '../services/health';
import { interval, Subscription, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  form: LoginRequest = {
    username: '',
    password: ''
  };

  loading = false;
  error = '';
  hidePassword = true;
  health: HealthStatus | null = null;
  private healthSub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private healthService: HealthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

ngOnInit(): void {
  this.checkHealth();
  this.healthSub = interval(15000).pipe(
    switchMap(() => this.healthService.getHealth().pipe(
      catchError(() => of({ status: 'DOWN' }))
    ))
  ).subscribe(data => {
    this.health = data;
    this.cdr.detectChanges();
  });
}

  ngOnDestroy(): void {
    this.healthSub?.unsubscribe();
  }

  checkHealth(): void {
    this.healthService.getHealth().subscribe({
      next: (data) => {
        this.health = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.health = { status: 'DOWN' };
        this.cdr.detectChanges();
      }
    });
  }

  login(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.form).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.error = 'Invalid username or password';
        } else {
          this.error = 'Backend is unavailable. Please try again later.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}