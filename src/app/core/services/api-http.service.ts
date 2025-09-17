import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiHttpService {

  constructor(private http: HttpClient) {}
  
  private skipLoadingOptions = {
    headers: new HttpHeaders({ 'X-Skip-Loading': 'true' }),
  };

  // ===== Normal requests (có spinner) =====
  get<T>(url: string, options?: object): Observable<T> {
    return this.http.get<T>(url, options);
  }

  post<T>(url: string, body: any, options?: object): Observable<T> {
    return this.http.post<T>(url, body, options);
  }

  put<T>(url: string, body: any, options?: object): Observable<T> {
    return this.http.put<T>(url, body, options);
  }

  delete<T>(url: string, options?: object): Observable<T> {
    return this.http.delete<T>(url, options);
  }

  // ===== Requests without spinner =====
  getWithoutLoading<T>(url: string, options?: object): Observable<T> {
    return this.http.get<T>(url, { ...this.skipLoadingOptions, ...options });
  }

  postWithoutLoading<T>(url: string, body: any, options?: object): Observable<T> {
    return this.http.post<T>(url, body, {
      ...this.skipLoadingOptions,
      ...options,
    });
  }

  putWithoutLoading<T>(url: string, body: any, options?: object): Observable<T> {
    return this.http.put<T>(url, body, {
      ...this.skipLoadingOptions,
      ...options,
    });
  }

  deleteWithoutLoading<T>(url: string, options?: object): Observable<T> {
    return this.http.delete<T>(url, { ...this.skipLoadingOptions, ...options });
  }
}
