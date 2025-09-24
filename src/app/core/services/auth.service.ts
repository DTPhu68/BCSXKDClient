// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthUser, LoginRequest, LoginResponse } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';
import { ApiHttpService } from './api-http.service';
import { Router } from '@angular/router';
import { SIDEBAR_MENU } from 'src/app/layout/models/sidebar.menudata';
import { SidebarMenuItem } from 'src/app/layout/models/sidebar-menu-item.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Storage keys
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private readonly REMEMBER_KEY = 'remember';

  constructor(private api: ApiHttpService, private router: Router) {
    const remember = localStorage.getItem(this.REMEMBER_KEY) === 'true';
    const storage = remember ? localStorage : sessionStorage;

    const token = storage.getItem(this.TOKEN_KEY);
    const user = storage.getItem(this.USER_KEY);

    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    } else {
      this.currentUserSubject.next(null);
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.api.postWithoutLoading<LoginResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => {
        const storage = request.remember ? localStorage : sessionStorage;
        // Lưu remember preference
        localStorage.setItem(this.REMEMBER_KEY, request.remember.toString());

        // Lưu auth data
        storage.setItem(this.TOKEN_KEY, response.token);
        storage.setItem(this.USER_KEY, JSON.stringify(response.user));

        // Cập nhật subjects
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    // Clear cả localStorage và sessionStorage để đảm bảo
    [localStorage, sessionStorage].forEach((storage) => {
      storage.removeItem(this.TOKEN_KEY);
      storage.removeItem(this.USER_KEY);
    });

    // Clear remember preference
    localStorage.removeItem(this.REMEMBER_KEY);

    // Reset subjects
    this.currentUserSubject.next(null);

    // Redirect to login
    this.router.navigate(['/login']);
  }

  get isAuthenticated(): boolean {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    return !!this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(roleId: string): boolean {
    const user = this.getCurrentUser();
    return !!user?.roles.some((r) => r === roleId);
  }
  //hasRole chỉ kiểm tra theo roleId – không xét unitId, nếu bạn cần giới hạn theo đơn vị
  // sau thì có thể mở rộng.
  hasAnyRole(roleIds: string[]): boolean {
    const user = this.getCurrentUser();
    return !!user?.roles.some((r) => roleIds.includes(r));
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getKhoiId(): number | null {
    return this.currentUserSubject.value ? this.currentUserSubject.value.khoiId : null;
  }
  getDonViId(): number | null {
    return this.currentUserSubject.value ? this.currentUserSubject.value.donViId : null;
  }

  // tìm object trong SIDEBAR_MENU theo khoiId
  getKhoiMenu(): SidebarMenuItem | undefined {
    const khoiId = this.getKhoiId();
    if (!khoiId) return undefined;
    return SIDEBAR_MENU.find((x) => x.khoiId === khoiId);
  }

  getKhoiName(): string | undefined {
    const khoiId = this.getKhoiId();
    if (!khoiId) return undefined;
    return SIDEBAR_MENU.find((x) => x.khoiId === khoiId)?.label;
  }

  // nếu cần icon luôn thì gom ở đây luôn
  getKhoiIcon(): string | undefined {
    const khoiId = this.getKhoiId();
    if (!khoiId) return undefined;
    return SIDEBAR_MENU.find((x) => x.khoiId === khoiId)?.icon;
  }
}
