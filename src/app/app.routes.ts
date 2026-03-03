import { Routes } from '@angular/router';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.HomeComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./customers/customer-list/customer-list').then(m => m.CustomerListComponent)
      },
      {
        path: 'customers/:id',
        loadComponent: () => import('./customers/customer-detail/customer-detail').then(m => m.CustomerDetailComponent)
      },
      {
        path: 'customers/:id/accounts/:accountNumber',
        loadComponent: () => import('./account-payments/account-payments').then(m => m.AccountPaymentsComponent)
      },
      {
        path: 'providers',
        loadComponent: () => import('./providers/providers').then(m => m.ProvidersComponent)
      },
      {
        path: 'providers/:id',
        loadComponent: () => import('./providers/provider-detail/provider-detail').then(m => m.ProviderDetailComponent)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];