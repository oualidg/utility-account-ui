import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService, UserResponse, UpdateUserRequest, Role } from '../../services/user';

@Component({
  selector: 'app-edit-user-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-user-dialog.html',
  styleUrl: './edit-user-dialog.css'
})
export class EditUserDialogComponent {

  form: UpdateUserRequest;

  roles: { value: Role; label: string }[] = [
    { value: 'ROLE_ADMIN',    label: 'Admin' },
    { value: 'ROLE_OPERATOR', label: 'Operator' }
  ];

  loading = false;
  error = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UserResponse,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      enabled: user.enabled
    };
  }

  isFormValid(): boolean {
    return !!(this.form.firstName && this.form.lastName && this.form.email && this.form.role);
  }

  submit(): void {
    this.loading = true;
    this.error = '';
    this.fieldErrors = {};

    this.userService.update(this.user.id, this.form).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update user';
        this.fieldErrors = err.error?.validationErrors || {};
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}