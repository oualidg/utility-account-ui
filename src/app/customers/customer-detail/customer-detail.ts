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
    CurrencyPipe
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
    private cdr: ChangeDetectorRef
  ) {}

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
    // TODO: open edit dialog
    console.log('edit clicked');
  }

  delete(): void {
    // TODO: open confirm dialog
    console.log('delete clicked');
  }
}