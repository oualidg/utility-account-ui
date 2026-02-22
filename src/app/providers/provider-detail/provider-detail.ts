import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProviderService, Provider } from '../../services/provider';
import { ReportService, ProviderReconciliation } from '../../services/report';

@Component({
  selector: 'app-provider-detail',
  imports: [
    DatePipe,
    CurrencyPipe,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './provider-detail.html',
  styleUrl: './provider-detail.css'
})
export class ProviderDetailComponent implements OnInit {

  provider: Provider | null = null;
  reconciliation: ProviderReconciliation | null = null;
  loadingProvider = true;
  loadingRecon = false;
  error = '';

  paymentColumns = ['receiptNumber', 'amount', 'paymentDate', 'accountNumber'];

  selectedMonth: number;
  selectedYear: number;

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  years: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private providerService: ProviderService,
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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.providerService.getById(id).subscribe({
      next: (data) => {
        this.provider = data;
        this.loadingProvider = false;
        this.loadReconciliation();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load provider';
        this.loadingProvider = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadReconciliation(): void {
    if (!this.provider) return;
    this.loadingRecon = true;
    this.reconciliation = null;

    const from = new Date(Date.UTC(this.selectedYear, this.selectedMonth - 1, 1));
    const to = new Date(Date.UTC(this.selectedYear, this.selectedMonth, 0, 23, 59, 59));

    this.reportService.getReconciliation(
      this.provider.code,
      from.toISOString(),
      to.toISOString()
    ).subscribe({
      next: (data) => {
        this.reconciliation = data;
        this.loadingRecon = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load reconciliation';
        this.loadingRecon = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/providers']);
  }

  deactivate(): void {
    if (!this.provider) return;
    const confirmed = window.confirm(
      `Deactivate ${this.provider.name}?\n\nThis will immediately invalidate their API key.`
    );
    if (!confirmed) return;

    this.providerService.deactivate(this.provider.id).subscribe({
      next: () => { this.ngOnInit(); },
      error: (err) => {
        this.error = err.error?.message || 'Failed to deactivate provider';
        this.cdr.detectChanges();
      }
    });
  }

  reactivate(): void {
    if (!this.provider) return;
    this.providerService.reactivate(this.provider.id).subscribe({
      next: () => { this.ngOnInit(); },
      error: (err) => {
        this.error = err.error?.message || 'Failed to reactivate provider';
        this.cdr.detectChanges();
      }
    });
  }

  regenerateKey(): void {
    if (!this.provider) return;
    const confirmed = window.confirm(
      `Regenerate API key for ${this.provider.name}?\n\nThe current key will be invalidated immediately.`
    );
    if (!confirmed) return;

    this.providerService.regenerateKey(this.provider.id).subscribe({
      next: (result) => {
        navigator.clipboard.writeText(result.apiKey).then(() => {
          alert(`New API Key:\n\n${result.apiKey}\n\n✓ Copied to clipboard.\n\nStore this securely — it will not be shown again.`);
        }).catch(() => {
          alert(`New API Key:\n\n${result.apiKey}\n\nStore this securely — it will not be shown again.`);
        });
        this.ngOnInit();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to regenerate key';
        this.cdr.detectChanges();
      }
    });
  }

  downloadCsv(): void {
    if (!this.reconciliation) return;

    const period = `${this.months.find(m => m.value === this.selectedMonth)?.label} ${this.selectedYear}`;

    const summary = [
      ['Provider', this.reconciliation.providerName],
      ['Period', period],
      ['Total Transactions', this.reconciliation.totalCount],
      ['Total Amount', this.reconciliation.totalAmount],
      [],
      ['Receipt', 'Amount', 'Date', 'Account']
    ];

    const rows = this.reconciliation.payments.map(p => [
      p.receiptNumber,
      p.amount,
      p.paymentDate,
      p.accountNumber
    ]);

    const csv = [...summary, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recon-${this.provider?.code}-${this.selectedYear}-${String(this.selectedMonth).padStart(2, '0')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}