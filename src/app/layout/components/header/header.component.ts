import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthUser } from 'src/app/shared/models/auth-user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<boolean>();
  @Input() isSidebarCollapsed = false;
  roles: string[] = ['Admin', 'User', 'Manager'];
  // currentUser = { fullName: 'Nguyen Van A' }; // Giả sử bạn có thông tin người dùng hiện tại
  currentUser: Partial<AuthUser> | null = null;
  

  constructor(private authService: AuthService) {}

   ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = {
        userId: user.userId,
        userName: user.userName,
        fullName: user.fullName,
        roles: user.roles,
      };      
    }
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.toggleSidebarEvent.emit(this.isSidebarCollapsed);
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }
}
