import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerService, CustomerDetailed, Account } from '../../services/customer';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditCustomerDialogComponent } from '../edit-customer-dialog/edit-customer-dialog';
import { DeleteCustomerDialogComponent } from '../delete-customer-dialog/delete-customer-dialog';

@Component({
  selector: 'app-customer-detail',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DatePipe,
    CurrencyPipe,
    MatDialogModule
  ],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.css'
})
export class CustomerDetailComponent implements OnInit {

  customer: CustomerDetailed | null = null;
  loading = true;
  error = '';

  accountColumns = ['accountNumber', 'balance', 'isMainAccount', 'createdAt', 'action'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.customerService.getById(id).subscribe({
      next: (data) => {
        this.customer = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load customer';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToPayments(account: Account): void {
    this.router.navigate(
      ['/customers', this.customer?.customerId, 'accounts', account.accountNumber],
      { state: { account } }
    );
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  edit(): void {
    const dialogRef = this.dialog.open(EditCustomerDialogComponent, {
      width: '480px',
      data: this.customer
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.customer = updated;
        this.cdr.detectChanges();
      }
    });
  }

  delete(): void {
    const dialogRef = this.dialog.open(DeleteCustomerDialogComponent, {
      width: '480px',
      data: this.customer
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) {
        this.router.navigate(['/customers']);
      }
    });
  }
}