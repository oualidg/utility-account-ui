import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportService, PaymentRecord } from '../services/report';
import { Account } from '../services/customer';

@Component({
  selector: 'app-account-payments',
  imports: [
    DatePipe,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './account-payments.html',
  styleUrl: './account-payments.css'
})
export class AccountPaymentsComponent implements OnInit {

  account: Account | null = null;
  payments: PaymentRecord[] = [];
  loading = true;
  error = '';

  paymentColumns = ['receiptNumber', 'amount', 'paymentDate', 'providerCode'];

  customerId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

ngOnInit(): void {
  // Read account details from router state
  this.account = history.state?.account || null;

  this.customerId = Number(this.route.snapshot.paramMap.get('id'));
  const accountNumber = Number(this.route.snapshot.paramMap.get('accountNumber'));

  this.reportService.getPaymentsByAccount(accountNumber).subscribe({
    next: (data) => {
      this.payments = data;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.error = err.error?.message || 'Failed to load payments';
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  goBack(): void {
    this.router.navigate(['/customers', this.customerId]);
  }
}