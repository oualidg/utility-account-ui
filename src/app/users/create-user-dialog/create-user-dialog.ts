import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService, CreateUserRequest, Role } from '../../services/user';

@Component({
  selector: 'app-create-user-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-user-dialog.html',
  styleUrl: './create-user-dialog.css'
})
export class CreateUserDialogComponent {

  form: CreateUserRequest = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'ROLE_OPERATOR'
  };

  roles: { value: Role; label: string }[] = [
    { value: 'ROLE_ADMIN',    label: 'Admin' },
    { value: 'ROLE_OPERATOR', label: 'Operator' }
  ];

  loading = false;
  error = '';
  fieldErrors: { [key: string]: string } = {};

  // Set after successful creation — shows temp password to admin
  temporaryPassword = '';
  showTempPassword = false;

  constructor(
    private dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  isFormValid(): boolean {
    return !!(
      this.form.username &&
      this.form.firstName &&
      this.form.lastName &&
      this.form.email &&
      this.form.role
    );
  }

  submit(): void {
    this.loading = true;
    this.error = '';
    this.fieldErrors = {};

    this.userService.create(this.form).subscribe({
      next: (response) => {
        this.temporaryPassword = response.temporaryPassword;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create user';
        this.fieldErrors = err.error?.validationErrors || {};
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  done(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}