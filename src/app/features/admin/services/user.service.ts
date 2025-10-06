import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserList } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserList[]> {
    return this.http.get<UserList[]>(this.baseUrl);
  }

  // ví dụ thêm các API khác cho tiện sau này
  getUser(id: number): Observable<UserList> {
    return this.http.get<UserList>(`${this.baseUrl}/${id}`);
  }

  addUser(dto: any): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  updateUser(id: number, dto: any): Observable<any> {
    console.log('Updating user:', id, dto);
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // toggleActive(id: number): Observable<any> {
  //   return this.http.patch(`${this.baseUrl}/${id}/active`, {});
  // }
  toggleActive(id: number, isActive: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status?isActive=${isActive}`, {});
  }

  resetPassword(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/reset-password`, {});
  }
}
