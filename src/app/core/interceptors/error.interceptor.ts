import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppValidationError } from '../models/app-validation-error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // 🚨 Network / client runtime errors
        if (error.status === 0) {
          this.toastr.error('Không thể kết nối đến máy chủ', 'Lỗi mạng');
          return throwError(() => error);
        }

        if (error.error instanceof ErrorEvent) {
          this.toastr.error(error.error.message || 'Client Error', 'Lỗi');
          return throwError(() => error);
        }

        // 🚨 HTTP status code errors
        switch (error.status) {
          case 400:
            if (error.error?.errors) {
              // Validation lỗi từ .NET ModelState
              const validationErrors = error.error.errors as AppValidationError;
              const messages = Object.values(validationErrors).flat();

              this.toastr.error(messages.join('<br/>'), 'Lỗi xác thực', {
                enableHtml: true,
              });

              // Trả về để form xử lý field-level errors
              return throwError(() => validationErrors);
            } else if (typeof error.error === 'string') {
              this.toastr.error(error.error, 'Lỗi 400');
              return throwError(() => error.error);
            } else if (error.error?.message) {
              this.toastr.error(error.error.message, 'Lỗi 400');
              return throwError(() => error.error.message);
            } else {
              this.toastr.error('Yêu cầu không hợp lệ', 'Lỗi 400');
              return throwError(() => error);
            }

          case 401:
            this.toastr.error(
              error.error?.message ||
                'Bạn chưa đăng nhập hoặc phiên đã hết hạn',
              'Unauthorized'
            );
            this.router.navigateByUrl('/login');
            return throwError(() => error);

          case 403:
            this.toastr.error(
              'Bạn không có quyền thực hiện hành động này',
              'Bị cấm'
            );
            return throwError(() => error);

          case 404:
            this.router.navigateByUrl('/not-found');
            return throwError(() => error);

          case 500:
            const apiError = {
              statusCode: error.error?.statusCode ?? 500,
              message: error.error?.message ?? 'Lỗi máy chủ không xác định',
              details: error.error?.details ?? 'Không có thông tin chi tiết',
            };
            console.error('Server Error:', error);
            this.router.navigateByUrl('/server-error', {
              state: apiError,
            });
            return throwError(() => apiError);

          default:
            const message = error.error?.message || 'Lỗi không xác định';
            this.toastr.error(message, `Lỗi ${error.status}`);
            console.error('Unhandled error:', error);
            return throwError(() => error);
        }
      })
    );
  }
}
