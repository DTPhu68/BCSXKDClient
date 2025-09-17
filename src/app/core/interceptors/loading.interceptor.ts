import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BusyService } from '../services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private busyService: BusyService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipLoading = request.headers.get('X-Skip-Loading');
    if (!skipLoading) {
      this.busyService.busy();
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (!skipLoading) {
          this.busyService.idle();
        }
      })
    );
  }
}
