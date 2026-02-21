import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class ShellComponent {

  navItems = [
    { label: 'Home',      icon: 'home',        route: '/home' },
    { label: 'Dashboard', icon: 'dashboard',   route: '/dashboard' },
    { label: 'Customers', icon: 'people',      route: '/customers' },
    { label: 'Providers', icon: 'business',    route: '/providers' },
  ];

}