import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService, UserResponse } from '../../services/user';

@Component({
  selector: 'app-delete-user-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './delete-user-dialog.html',
  styleUrl: './delete-user-dialog.css'
})
export class DeleteUserDialogComponent {

  loading = false;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UserResponse,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  confirm(): void {
    this.loading = true;
    this.error = '';

    this.userService.delete(this.user.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete user';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}