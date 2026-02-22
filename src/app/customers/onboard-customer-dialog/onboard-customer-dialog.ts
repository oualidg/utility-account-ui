import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerService, CreateCustomerRequest } from '../../services/customer';

@Component({
  selector: 'app-onboard-customer-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './onboard-customer-dialog.html',
  styleUrl: './onboard-customer-dialog.css'
})
export class OnboardCustomerDialogComponent {

  form: CreateCustomerRequest = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: ''
  };

  loading = false;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<OnboardCustomerDialogComponent>,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) { }


  fieldErrors: { [key: string]: string } = {};

  submit(): void {
    this.loading = true;
    this.error = '';
    this.fieldErrors = {};

    this.customerService.create(this.form).subscribe({
      next: (customer) => {
        this.dialogRef.close(customer);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create customer';
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