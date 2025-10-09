import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangePwdModalComponent } from 'src/app/auth/components/change-pwd-modal/change-pwd-modal.component';
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
  today: Date = new Date(); // Stores the current date and time
 bsModalRef?: BsModalRef;
  constructor(private authService: AuthService,private modalService: BsModalService) {}

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

  openChangePassword() {
    this.bsModalRef = this.modalService.show(ChangePwdModalComponent, {
      class: 'modal-md', ignoreBackdropClick: true
    });
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }
}
