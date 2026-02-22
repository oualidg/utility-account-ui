import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerListComponent implements OnInit {

  // Full list
  allCustomers: CustomerSummary[] = [];
  displayedCustomers: CustomerSummary[] = [];
  loadingList = true;
  listError = false;

  // Search
  searchType = 'ID';
  searchValue = '';
  searching = false;
  searchError = '';

  displayedColumns = ['customerId', 'firstName', 'lastName', 'email', 'mobileNumber', 'action'];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.allCustomers = data;
        this.displayedCustomers = data;
        this.loadingList = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.listError = true;
        this.loadingList = false;
        this.cdr.detectChanges();
      }
    });
  }

  search(): void {
    if (!this.searchValue.trim()) return;

    this.searching = true;
    this.searchError = '';

    if (this.searchType === 'ID') {
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

    } else if (this.searchType === 'Mobile') {
      this.customerService.searchByMobile(this.searchValue).subscribe({
        next: (customers) => {
          this.displayedCustomers = customers;
          this.searching = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.searching = false;
          this.searchError = err.error?.message || 'Something went wrong';
          this.cdr.detectChanges();
        }
      });
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.searchError = '';
    this.displayedCustomers = this.allCustomers;
  }

  goToCustomer(id: number): void {
    this.router.navigate(['/customers', id]);
  }

  onboard(): void {
    const dialogRef = this.dialog.open(OnboardCustomerDialogComponent, {
      width: '480px'
    });

    dialogRef.afterClosed().subscribe(customer => {
      if (customer) {
        this.ngOnInit();
      }
    });
  }
}