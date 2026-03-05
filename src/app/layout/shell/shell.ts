import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth';
import { ChangePasswordDialogComponent } from '../../users/change-password-dialog/change-password-dialog';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class ShellComponent {

  navItems = [
    { label: 'Dashboard', icon: 'dashboard',       route: '/dashboard', adminOnly: true },
    { label: 'Customers', icon: 'people',           route: '/customers', adminOnly: false },
    { label: 'Providers', icon: 'business',         route: '/providers', adminOnly: true },
    { label: 'Users',     icon: 'manage_accounts',  route: '/users',     adminOnly: true },
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  openChangePassword(): void {
    this.dialog.open(ChangePasswordDialogComponent, { width: '480px' });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}