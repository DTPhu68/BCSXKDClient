import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { DevLoginService } from 'src/app/core/services/dev-login.service';
import { DevLoginKhoi, DevLoginRole, DevLoginUser } from 'src/app/shared/models/dev-login.model';

@Component({
  selector: 'app-dev-login',
  templateUrl: './dev-login.component.html',
  styleUrls: ['./dev-login.component.scss'],
})
export class DevLoginComponent {
  form!: FormGroup;
  roles: DevLoginRole[] = [];
  khois: DevLoginKhoi[] = [];
  users: DevLoginUser[] = [];
  filteredUsers: DevLoginUser[] = [];
  loading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private devLoginService: DevLoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      roleId: ['NhapLieu'],
      khoiId: ['4'],
    });

    this.loadRoles();
    this.loadKhois();
    this.loadUsers();

    // Lọc khi thay đổi dropdown
    this.form.valueChanges.subscribe(() => this.filterUsers());
  }

  loadRoles(): void {
    this.devLoginService.getRoles().subscribe({
      next: (res) => (this.roles = [{ roleId: 'ALL', roleName: 'Tất cả' }, ...res]),
    });
  }

  loadKhois(): void {
    this.devLoginService.getKhois().subscribe({
      next: (res) => (this.khois = [{ khoiId: 0, khoiName: 'Tất cả' }, ...res]),
    });
  }

  loadUsers(): void {
    this.devLoginService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredUsers = [...this.users];
      },
    });
  }

  filterUsers(): void {
    const { roleId, khoiId } = this.form.value;
    this.filteredUsers = this.users.filter(
      (u) => (roleId === 'ALL' || u.roleId === roleId) && (khoiId === 'ALL' || u.khoiId === +khoiId)
    );
  }

  login(userName: string): void {
    this.loading = true;
    const request = {
      userName,
      password: userName, // mật khẩu mặc định = username
      remember: false,
    };

    this.authService.login(request).subscribe({
      next: () => {
        const currentUser = this.authService.getCurrentUser();
        //console.log('AuthUser:', this.authService.getCurrentUser());
        if (currentUser.roles.includes('Admin')) {
          this.router.navigate(['/admin']);
        } else if (currentUser.roles.includes('NhapLieu')) {
          this.router.navigate(['/month-entries', currentUser.khoiId]);
        } else if (currentUser.roles.includes('BaoCao')) {
          console.log('Navigating to /' + currentUser.khoiId);
          this.router.navigate(['/', currentUser.khoiId]);
          // this.router.navigate(['/reports', currentUser.khoiId]);
        } else if (currentUser.roles.includes('ToanNganh')) {
          this.router.navigate(['/toan-nganh']);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
