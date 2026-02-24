import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProviderService, Provider } from '../services/provider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OnboardProviderDialogComponent } from './onboard-provider-dialog/onboard-provider-dialog';

@Component({
  selector: 'app-providers',
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './providers.html',
  styleUrl: './providers.css'
})
export class ProvidersComponent implements OnInit {

  providers: Provider[] = [];
  loading = true;
  error = '';

  displayedColumns = ['code', 'name', 'apiKeyPrefix', 'status', 'createdAt', 'actions'];

  constructor(
    private providerService: ProviderService,
    private dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.loading = true;
    this.error = '';

    this.providerService.getAll().subscribe({
      next: (data) => {
        this.providers = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load providers';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deactivate(provider: Provider): void {
    // TODO: confirm dialog
    this.providerService.deactivate(provider.id).subscribe({
      next: () => {
        this.loadProviders();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to deactivate provider';
        this.cdr.detectChanges();
      }
    });
  }

  reactivate(provider: Provider): void {
    this.providerService.reactivate(provider.id).subscribe({
      next: () => {
        this.loadProviders();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to reactivate provider';
        this.cdr.detectChanges();
      }
    });
  }

  regenerateKey(provider: Provider): void {
    const confirmed = window.confirm(
      `Regenerate API key for ${provider.name}?\n\nThe current key will be invalidated immediately.`
    );

    if (!confirmed) return;

    this.providerService.regenerateKey(provider.id).subscribe({
      next: (result) => {
        this.showNewKey(result.apiKey, provider.name);
        this.loadProviders();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to regenerate key';
        this.cdr.detectChanges();
      }
    });
  }

  showNewKey(apiKey: string, providerName: string): void {
    // Copy to clipboard
    navigator.clipboard.writeText(apiKey).then(() => {
      alert(`New API Key for ${providerName}:\n\n${apiKey}\n\n✓ Copied to clipboard automatically.\n\nStore this securely — it will not be shown again.`);
    }).catch(() => {
      alert(`New API Key for ${providerName}:\n\n${apiKey}\n\nStore this securely — it will not be shown again.`);
    });
  }

  onboard(): void {
    const dialogRef = this.dialog.open(OnboardProviderDialogComponent, {
      width: '480px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Show the new API key before reloading
        navigator.clipboard.writeText(result.apiKey).then(() => {
          alert(`Provider onboarded!\n\nAPI Key:\n${result.apiKey}\n\n✓ Copied to clipboard.\n\nStore this securely — it will not be shown again.`);
        }).catch(() => {
          alert(`Provider onboarded!\n\nAPI Key:\n${result.apiKey}\n\nStore this securely — it will not be shown again.`);
        });
        this.loadProviders();
      }
    });
  }

  goToProvider(id: number): void {
    this.router.navigate(['/providers', id]);
  }

}