import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProviderService, CreateProviderRequest } from '../../services/provider';

@Component({
  selector: 'app-onboard-provider-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './onboard-provider-dialog.html',
  styleUrl: './onboard-provider-dialog.css'
})
export class OnboardProviderDialogComponent {

  form: CreateProviderRequest = {
    code: '',
    name: ''
  };

  loading = false;
  error = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private dialogRef: MatDialogRef<OnboardProviderDialogComponent>,
    private providerService: ProviderService,
    private cdr: ChangeDetectorRef
  ) {}

  submit(): void {
    this.loading = true;
    this.error = '';
    this.fieldErrors = {};

    this.providerService.create(this.form).subscribe({
      next: (result) => {
        this.dialogRef.close(result);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to onboard provider';
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