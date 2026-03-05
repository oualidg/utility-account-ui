import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KeyValuePipe } from '@angular/common';
import { interval, Subscription, switchMap, catchError, of } from 'rxjs';
import { HealthService, HealthStatus } from '../services/health';
import { InfoService, AppInfo } from '../services/info';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, MatButtonModule, KeyValuePipe, MatProgressSpinnerModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  private allCards = [
    {
      title: 'Dashboard',
      description: 'View payment summaries and provider breakdowns',
      icon: 'dashboard',
      route: '/dashboard',
      adminOnly: true
    },
    {
      title: 'Customers',
      description: 'Manage customer accounts and profiles',
      icon: 'people',
      route: '/customers',
      adminOnly: false
    },
    {
      title: 'Providers',
      description: 'Manage payment providers and API keys',
      icon: 'business',
      route: '/providers',
      adminOnly: true
    },
    {
      title: 'Users',
      description: 'Manage admin and operator user accounts',
      icon: 'manage_accounts',
      route: '/users',
      adminOnly: true
    }
  ];

  get cards() {
    return this.allCards.filter(c => !c.adminOnly || this.authService.isAdmin());
  }

  health: HealthStatus | null = null;
  loadingHealth = true;
  appInfo: AppInfo | null = null;
  private healthSub: Subscription | null = null;

  private infoService = inject(InfoService);

  constructor(
    private router: Router,
    private healthService: HealthService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.checkHealth();
    this.infoService.getInfo().subscribe({
      next: (data: AppInfo) => { this.appInfo = data; this.cdr.detectChanges(); },
      error: () => {}
    });
    this.healthSub = interval(15000).pipe(
      switchMap(() => this.healthService.getHealth().pipe(
        catchError(() => of({ status: 'DOWN' }))
      ))
    ).subscribe((data: HealthStatus) => {
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
        this.loadingHealth = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.health = { status: 'DOWN' };
        this.loadingHealth = false;
        this.cdr.detectChanges();
      }
    });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  getComponentKeys(): string[] {
    return this.health?.components ? Object.keys(this.health.components) : [];
  }

  isEmptyValue(value: any): boolean {
    if (value === null || value === undefined || value === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  }
}