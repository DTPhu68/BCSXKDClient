import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MockKhoiGroup } from 'src/app/core/models/mock-login.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-mock-login',
  templateUrl: './mock-login.component.html',
  styleUrls: ['./mock-login.component.scss'],
})
export class MockLoginComponent {
  mockKhoiGroup: MockKhoiGroup[] = [];
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit() {
    import('src/app/core/models/mock-login.data').then((m) => {
      this.mockKhoiGroup = m.MOCK_LOGIN_DATA;
    });
  }

  login(userName: string): void {
    this.loading = true;
    const request = {
      userName: userName,
      password: userName,
      remember: false, // Mặc định là false để không lưu vào localStorage
    };
    this.authService.login(request).subscribe({
      next: () => {
        const currentUser = this.authService.getCurrentUser();
       // console.log('AuthUser:', this.authService.getCurrentUser());
        if(currentUser.roles.includes('Admin')) {
          this.router.navigate(['/admin']);
        } else if(currentUser.roles.includes('NhapLieu')) {
          this.router.navigate(['/month-entries',currentUser.khoiId]);
        } else if(currentUser.roles.includes('BaoCao')) {
          console.log('Navigating to /' + currentUser.khoiId);
          this.router.navigate(['/',currentUser.khoiId]);
          // this.router.navigate(['/reports',currentUser.khoiId]);
        } else if(currentUser.roles.includes('ToanNganh')) {
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
