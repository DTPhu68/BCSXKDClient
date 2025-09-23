import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect to home if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.fb.group({
      userName: ['xndmvi', Validators.required],
      password: ['xndmvi', Validators.required],
      remember: [false],
    });
  }

  ngAfterViewInit() {
    this.usernameInput.nativeElement.focus();
  }
  // Convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  submit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid || this.loading) return;

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading = false;
        //this.router.navigate(['/']);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.error = typeof err === 'string' ? err : 'Đăng nhập thất bại';
      },
    });
  }
}
