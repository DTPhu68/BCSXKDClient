import { Component } from '@angular/core';
import { ApiException } from '../models';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  template: `
    <div class="container mt-5">
      <h2 class="text-danger">500 - Lỗi máy chủ</h2>
      <div *ngIf="error; else fallback">
        <div class="alert alert-danger">
          <strong>{{ error.message }}</strong>
        </div>

        <div *ngIf="error.details" class="mt-3">
          <h5>Chi tiết lỗi (Stack trace):</h5>
          <pre class="bg-light p-3 border rounded">{{ error.details }}</pre>
        </div>
      </div>

      <ng-template #fallback>
        <p>Không có thông tin chi tiết lỗi để hiển thị.</p>
      </ng-template>
      <button class="btn btn-secondary me-2" (click)="goBack()">Quay lại</button>
      <button class="btn btn-primary" (click)="goHome()">Trang chủ</button>
    </div>
  `,
  styles: [
    `
      pre {
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 0.875rem;
        max-height: 500px;
        overflow: auto;
      }
    `,
  ],
})
export class ServerErrorComponent {
  error: ApiException | null = null;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    // const nav = this.router.getCurrentNavigation();
    // this.error = nav?.extras?.state?.['error'] ?? null;
    //this.error = this.location.getState() as ApiException;
    const state = this.location.getState() as any;
    this.error = state?.message ? (state as ApiException) : null;
  }

  goHome() {
    this.router.navigate(['/']);
  }
  
  goBack() {
    this.location.back();
  }
}
