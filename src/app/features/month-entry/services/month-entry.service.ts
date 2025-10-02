import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MonthResponse } from 'src/app/shared/models/month-entry/month-response.model';
import { ReportStatus } from 'src/app/shared/models/report-status.enum';
import { SaveMonthRequest } from 'src/app/shared/models/month-entry/save-month-request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonthEntryService {
 private baseUrl = `${environment.apiUrl}/entry/months`;

  constructor(
    private http: HttpClient,
    // nếu cần đọc donViId từ auth
    // private authService: AuthService
  ) {}

    /**
   * Lấy dữ liệu nhập liệu tháng
   */
  getMonth(donViId: number, nam: number, thang: number): Observable<MonthResponse> {
    const url = `${this.baseUrl}/${donViId}/${nam}/${thang}`;
    return this.http.get<MonthResponse>(url);
  }

  /**
   * Lưu dữ liệu nhập liệu tháng
   */
  saveMonth(request: SaveMonthRequest): Observable<void> {
    return this.http.put<void>(this.baseUrl, request);
  }

  /**
   * Thay đổi trạng thái báo cáo tháng
   */
  changeStatus(headerId: number, status: ReportStatus): Observable<void> {
    const url = `${this.baseUrl}/${headerId}/status?status=${status}`;
    return this.http.patch<void>(url, null);
  }
}
