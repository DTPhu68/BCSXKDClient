import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container text-center mt-5">
      <i class="fas fa-ban fa-4x text-danger"></i>
      <h1 class="mt-3 text-danger">403 - Truy cập bị từ chối</h1>
      <p class="lead">Bạn không có quyền truy cập vào trang này.</p>
      <a (click)="goHome()" class="btn btn-primary mt-3">
        <i class="fas fa-home me-2"></i>
        Quay về trang chủ
      </a>
    </div>
  `,
  styles: [],
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
