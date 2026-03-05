import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UserService, UserResponse } from '../../services/user';
import { AuthService } from '../../services/auth';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog';
import { ResetPasswordDialogComponent } from '../reset-password-dialog/reset-password-dialog';
import { DeleteUserDialogComponent } from '../delete-user-dialog/delete-user-dialog';

@Component({
  selector: 'app-user-list',
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserListComponent implements OnInit {

  users: UserResponse[] = [];
  loading = true;
  error = false;

  displayedColumns = ['username', 'name', 'email', 'role', 'status', 'actions'];

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = false;

    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '480px'
    });
    dialogRef.afterClosed().subscribe(created => {
      if (created) this.loadUsers();
    });
  }

  openEditDialog(user: UserResponse): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '480px',
      data: user
    });
    dialogRef.afterClosed().subscribe(updated => {
      if (updated) this.loadUsers();
    });
  }

  openResetPasswordDialog(user: UserResponse): void {
    this.dialog.open(ResetPasswordDialogComponent, {
      width: '480px',
      data: user
    });
  }

  openDeleteDialog(user: UserResponse): void {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: '440px',
      data: user
    });
    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) this.loadUsers();
    });
  }

  isSelf(user: UserResponse): boolean {
    return user.username === this.authService.currentUser()?.username;
  }
}