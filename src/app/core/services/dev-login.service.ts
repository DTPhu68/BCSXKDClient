import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DevLoginRole, DevLoginKhoi, DevLoginUser } from 'src/app/shared/models/dev-login.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevLoginService {

    private baseUrl = environment.apiUrl + '/dev-login';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<DevLoginRole[]> {
    return this.http.get<DevLoginRole[]>(`${this.baseUrl}/roles`);
  }

  getKhois(): Observable<DevLoginKhoi[]> {
    return this.http.get<DevLoginKhoi[]>(`${this.baseUrl}/khois`);
  }

  getUsers(roleId?: string, khoiId?: number): Observable<DevLoginUser[]> {
    const params: any = {};
    if (roleId) params.roleId = roleId;
    if (khoiId) params.khoiId = khoiId;
    return this.http.get<DevLoginUser[]>(`${this.baseUrl}/users`, { params });
  }
}
