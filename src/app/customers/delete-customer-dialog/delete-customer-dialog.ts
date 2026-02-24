import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService, CustomerDetailed } from '../../services/customer';

@Component({
  selector: 'app-delete-customer-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './delete-customer-dialog.html',
  styleUrl: './delete-customer-dialog.css'
})
export class DeleteCustomerDialogComponent {

  loading = false;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public customer: CustomerDetailed,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  confirm(): void {
    this.loading = true;
    this.error = '';

    this.customerService.delete(this.customer.customerId).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete customer';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}