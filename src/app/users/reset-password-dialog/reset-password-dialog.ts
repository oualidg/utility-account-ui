import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService, UserResponse } from '../../services/user';

@Component({
  selector: 'app-reset-password-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password-dialog.html',
  styleUrl: './reset-password-dialog.css'
})
export class ResetPasswordDialogComponent {

  loading = false;
  error = '';
  temporaryPassword = '';
  showTempPassword = false;

  constructor(
    private dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UserResponse,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  confirm(): void {
    this.loading = true;
    this.error = '';

    this.userService.resetPassword(this.user.id).subscribe({
      next: (response) => {
        this.temporaryPassword = response.temporaryPassword;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to reset password';
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