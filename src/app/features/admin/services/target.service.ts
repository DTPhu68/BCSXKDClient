import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Target } from '../models/target.model';

@Injectable({
  providedIn: 'root',
})
export class TargetService {
  private baseUrl = environment.apiUrl + '/chitieus';

  constructor(private http: HttpClient) {}

  /** Lấy danh sách chỉ tiêu theo khối */
  getByKhoi(khoiId: number): Observable<Target[]> {
    return this.http.get<Target[]>(`${this.baseUrl}/khoi/${khoiId}`);
  }

  /** Cập nhật danh sách chỉ tiêu con (AddFrom) cho một chỉ tiêu tổng */
  updateAddFrom(toId: number, fromIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${toId}/addfrom`, fromIds);
  }
}
