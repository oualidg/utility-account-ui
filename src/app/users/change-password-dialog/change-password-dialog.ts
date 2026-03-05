import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-change-password-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.css'
})
export class ChangePasswordDialogComponent {

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  loading = false;
  error = '';
  success = false;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  hasUppercase(): boolean { return /[A-Z]/.test(this.newPassword); }
  hasLowercase(): boolean { return /[a-z]/.test(this.newPassword); }
  hasDigit(): boolean     { return /[0-9]/.test(this.newPassword); }
  hasSpecial(): boolean   { return /[@$!%*?&]/.test(this.newPassword); }

  getPasswordStrength(): { score: number; label: string; color: string } {
    const p = this.newPassword;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8)       score++;
    if (this.hasUppercase()) score++;
    if (this.hasLowercase()) score++;
    if (this.hasDigit())     score++;
    if (this.hasSpecial())   score++;
    if (score <= 2) return { score, label: 'Weak',   color: '#c62828' };
    if (score <= 3) return { score, label: 'Fair',   color: '#ef6c00' };
    if (score <= 4) return { score, label: 'Good',   color: '#1565c0' };
    return                 { score, label: 'Strong', color: '#2e7d32' };
  }

  passwordsMatch(): boolean {
    return !this.confirmPassword || this.newPassword === this.confirmPassword;
  }

  isFormValid(): boolean {
    const strength = this.getPasswordStrength();
    return !!(
      this.currentPassword &&
      this.newPassword &&
      this.confirmPassword &&
      this.newPassword === this.confirmPassword &&
      strength.score === 5
    );
  }

  submit(): void {
    this.loading = true;
    this.error = '';

    const userId = this.authService.currentUser()!.id;

    this.userService.changePassword(userId, {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to change password';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  done(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}