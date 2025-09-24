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
        //console.log('AuthUser:', this.authService.getCurrentUser());
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
