import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerService, CustomerSummary } from '../../services/customer';
import { OnboardCustomerDialogComponent } from '../onboard-customer-dialog/onboard-customer-dialog';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-list',
  imports: [
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerListComponent implements OnInit {

  // Table data
  customers: CustomerSummary[] = [];
  loadingList = true;
  listError = false;

  // Pagination state
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  // Search state
  searchType = 'ID';
  searchValue = '';
  searching = false;
  searchError = '';

  // Track whether we are in search mode so pagination calls the right endpoint
  activeSearchType: string | null = null;
  activeSearchValue: string | null = null;

  displayedColumns = ['customerId', 'firstName', 'lastName', 'mobileNumber', 'action'];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPage();
  }

  // -------------------------------------------------------------------------
  // Data loading
  // -------------------------------------------------------------------------

  loadPage(): void {
    this.loadingList = true;
    this.listError = false;

    if (this.activeSearchType === 'Mobile' && this.activeSearchValue) {
      this.customerService.searchByMobile(this.activeSearchValue, this.pageIndex, this.pageSize)
        .subscribe({
          next: (page) => this.handlePage(page),
          error: () => this.handleError()
        });

    } else if (this.activeSearchType === 'Surname' && this.activeSearchValue) {
      this.customerService.searchBySurname(this.activeSearchValue, this.pageIndex, this.pageSize)
        .subscribe({
          next: (page) => this.handlePage(page),
          error: () => this.handleError()
        });

    } else {
      this.customerService.getAll(this.pageIndex, this.pageSize)
        .subscribe({
          next: (page) => this.handlePage(page),
          error: () => this.handleError()
        });
    }
  }

  private handlePage(page: { content: CustomerSummary[]; totalElements: number }): void {
    this.customers = page.content;
    this.totalElements = page.totalElements;
    this.loadingList = false;
    this.cdr.detectChanges();
  }

  private handleError(): void {
    this.listError = true;
    this.loadingList = false;
    this.cdr.detectChanges();
  }

  // -------------------------------------------------------------------------
  // Pagination
  // -------------------------------------------------------------------------

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
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
  // Search
  // -------------------------------------------------------------------------

  search(): void {
    if (!this.searchValue.trim()) return;

    this.searchError = '';

    if (this.searchType === 'ID') {
      this.searching = true;
      this.customerService.getById(Number(this.searchValue)).subscribe({
        next: (customer) => {
          this.searching = false;
          this.router.navigate(['/customers', customer.customerId]);
        },
        error: (err) => {
          this.searching = false;
          this.searchError = err.error?.message || 'Something went wrong';
          this.cdr.detectChanges();
        }
      });

    } else {
      // Mobile or Surname — paginated search
      this.activeSearchType = this.searchType;
      this.activeSearchValue = this.searchValue;
      this.pageIndex = 0;
      this.loadPage();
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.searchError = '';

    // Only reload if we were in search mode — avoids unnecessary API call
    // when the user simply switches between toggle types
    if (this.activeSearchType !== null) {
      this.activeSearchType = null;
      this.activeSearchValue = null;
      this.pageIndex = 0;
      this.loadPage();
    } else {
      this.activeSearchType = null;
      this.activeSearchValue = null;
    }
  }

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  goToCustomer(id: number): void {
    this.router.navigate(['/customers', id]);
  }

  onboard(): void {
    const dialogRef = this.dialog.open(OnboardCustomerDialogComponent, {
      width: '480px'
    });

    dialogRef.afterClosed().subscribe(customer => {
      if (customer) {
        this.clearSearch();
      }
    });
  }
}