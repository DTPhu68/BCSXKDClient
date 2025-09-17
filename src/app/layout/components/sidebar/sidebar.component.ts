import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Input() isCollapsed = false;

  expandedMenu: string | null = null;
  userRoles: string[] = [];
  userName = '';

   private routerSub?: Subscription;
  private resizeHandler = () => this.checkScreenSize();
  
  constructor(private router: Router, public authService: AuthService) {  }

  ngOnInit() {
    this.loadUserProfile();
    this.checkScreenSize();

       // Lắng nghe resize
    window.addEventListener('resize', this.resizeHandler);

    // Reset submenu & collapse sidebar khi route change trên mobile
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth <= 768) {
          this.isCollapsed = true;
          this.collapsedChange.emit(true);
        }
      });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.routerSub?.unsubscribe();
  }

  loadUserProfile() {
     const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user?.userName;
      this.userRoles =Array.from(new Set(user.roles));
      // this.userAvatar = user.avatar || this.userAvatar;
    }
  }

  private checkScreenSize() {
    if (window.innerWidth <= 768) {
      this.isCollapsed = true;
      this.collapsedChange.emit(true);
    }
  }


toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);

    // lưu trạng thái (nếu muốn đồng bộ với LayoutShell)
    localStorage.setItem('sidebarCollapsed', this.isCollapsed.toString());
  }

  toggleSubmenu(menu: string) {
    if (this.isCollapsed) {
      this.toggleSidebar();
      this.expandedMenu = menu;
    } else {
      this.expandedMenu = this.expandedMenu === menu ? null : menu;
    }
  }
}
