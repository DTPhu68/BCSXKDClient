import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  fullUserName = 'Nguyen Van A';

   toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.toggleSidebarEvent.emit(this.isSidebarCollapsed);
  }

   logout(event: Event) {
    event.preventDefault();
    //this.authService.logout();
  }
}
