import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div class="text-center">
        <h1 class="display-1 fw-bold text-danger">404</h1>
        <p class="fs-3">
          😕
          <span class="text-dark">Trang bạn tìm không tồn tại!</span>
        </p>
        <p class="lead">Có thể đường dẫn bị sai, hoặc trang đã bị xóa.</p>
        <button class="btn btn-primary mt-3" (click)="goHome()">Quay về trang chủ</button>
      </div>
    </div>
  `,
  styles: [
    `
      h1 {
        font-size: 10rem;
      }
    `,
  ],
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
