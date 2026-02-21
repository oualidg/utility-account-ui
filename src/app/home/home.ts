import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  cards = [
    {
      title: 'Dashboard',
      description: 'View payment summaries and provider breakdowns',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      title: 'Customers',
      description: 'Manage customer accounts and profiles',
      icon: 'people',
      route: '/customers'
    },
    {
      title: 'Providers',
      description: 'Manage payment providers and API keys',
      icon: 'business',
      route: '/providers'
    }
  ];

  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
