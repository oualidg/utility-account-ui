import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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
  accountNumber: number = 0;

  // Pagination state
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  // Month/year filter
  selectedMonth: number;
  selectedYear: number;

  months = [
    { value: 1,  label: 'January' },
    { value: 2,  label: 'February' },
    { value: 3,  label: 'March' },
    { value: 4,  label: 'April' },
    { value: 5,  label: 'May' },
    { value: 6,  label: 'June' },
    { value: 7,  label: 'July' },
    { value: 8,  label: 'August' },
    { value: 9,  label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  years: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {
    const now = new Date();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedYear = now.getFullYear();

    for (let y = 2024; y <= now.getFullYear(); y++) {
      this.years.push(y);
    }
  }

  ngOnInit(): void {
    this.account = history.state?.account || null;
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.accountNumber = Number(this.route.snapshot.paramMap.get('accountNumber'));
    this.loadPayments();
  }

  // -------------------------------------------------------------------------
  // Data loading
  // -------------------------------------------------------------------------

  /** Called by the Load button — resets to page 0 when the filter changes. */
  loadPayments(): void {
    this.pageIndex = 0;
    this.loadPage();
  }

  loadPage(): void {
    this.loading = true;
    this.error = '';

    const from = new Date(Date.UTC(this.selectedYear, this.selectedMonth - 1, 1));
    const to   = new Date(Date.UTC(this.selectedYear, this.selectedMonth, 0, 23, 59, 59));

    this.reportService.getAccountPayments(
      this.accountNumber,
      from.toISOString(),
      to.toISOString(),
      this.pageIndex,
      this.pageSize
    ).subscribe({
      next: (page) => {
        this.payments      = page.content;
        this.totalElements = page.totalElements;
        this.loading       = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error   = err.error?.message || 'Failed to load payments';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // -------------------------------------------------------------------------
  // Pagination
  // -------------------------------------------------------------------------

  onPageSizeChange(newSize: number): void {
    this.pageSize  = newSize;
    this.pageIndex = 0;
    this.loadPage();
  }

  onPrevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadPage();
    }
  }

  onNextPage(): void {
    if ((this.pageIndex + 1) * this.pageSize < this.totalElements) {
      this.pageIndex++;
      this.loadPage();
    }
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  goBack(): void {
    this.router.navigate(['/customers', this.customerId]);
  }
}