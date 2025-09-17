import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RolesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);  
  const requiredRoles = route.data['roles'] as string[]; // lấy từ route data

  const user = authService.getCurrentUser();
  if (!user) {
    return router.parseUrl('/login');
  }

  const userRoles = user.roles.map((r) => r);
  const hasRole = requiredRoles.some((role) => userRoles.includes(role));
  return hasRole ? true : router.parseUrl('/unauthorized'); // hoặc redirect về trang báo lỗi
};
