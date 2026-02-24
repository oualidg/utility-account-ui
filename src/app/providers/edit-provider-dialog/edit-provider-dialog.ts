import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProviderService, Provider, UpdateProviderRequest } from '../../services/provider';

@Component({
  selector: 'app-edit-provider-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-provider-dialog.html',
  styleUrl: './edit-provider-dialog.css'
})
export class EditProviderDialogComponent {

  form: UpdateProviderRequest;
  loading = false;
  error = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private dialogRef: MatDialogRef<EditProviderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public provider: Provider,
    private providerService: ProviderService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = {
      name: provider.name
    };
  }

  submit(): void {
    this.loading = true;
    this.error = '';
    this.fieldErrors = {};

    this.providerService.update(this.provider.id, this.form).subscribe({
      next: (updated) => {
        this.dialogRef.close(updated);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update provider';
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