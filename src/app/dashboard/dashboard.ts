import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReportService, ReportSummary } from '../services/report';

@Component({
  selector: 'app-dashboard',
  imports: [
    CurrencyPipe,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  summary: ReportSummary | null = null;
  loading = true;
  error = '';

  providerColumns = ['providerCode', 'providerName', 'totalAmount', 'count'];

  // Month/year selector
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
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {
    const now = new Date();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedYear = now.getFullYear();

    // Generate years from 2024 to current year
    for (let y = 2024; y <= now.getFullYear(); y++) {
      this.years.push(y);
    }
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.error = '';
    this.summary = null;

    const from = new Date(Date.UTC(this.selectedYear, this.selectedMonth - 1, 1));
    const to = new Date(Date.UTC(this.selectedYear, this.selectedMonth, 0, 23, 59, 59));

    this.reportService.getSummary(from.toISOString(), to.toISOString()).subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load dashboard';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}