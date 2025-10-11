import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportStatus } from 'src/app/shared/models';
import { SaveYearRequest, YearResponse } from 'src/app/shared/models/year-entry';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class YearEntryService {
private baseUrl = `${environment.apiUrl}/entry/years`;

  constructor(private http: HttpClient) { }

    /**
   * Lấy dữ liệu nhập liệu năm
   * @param donViId ID đơn vị
   * @param nam Năm
   * @returns Observable<YearResponse>
   */
  getYear(donViId: number, nam: number): Observable<YearResponse> {
    const url = `${this.baseUrl}/${donViId}/${nam}`;
    return this.http.get<YearResponse>(url);
  }

  /**
   * Lưu dữ liệu nhập liệu năm
   */
  saveYear(request: SaveYearRequest): Observable<void> {
    return this.http.put<void>(this.baseUrl, request);
  }

   /**
   * Thay đổi trạng thái báo cáo năm
   */
  changeStatus(headerId: number, status: ReportStatus): Observable<void> {
    const url = `${this.baseUrl}/${headerId}/status?status=${status}`;
    return this.http.patch<void>(url, null);
  }
}
