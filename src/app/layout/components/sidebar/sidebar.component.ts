import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarMenuItem } from '../../models/sidebar-menu-item.model';
import { SIDEBAR_MENU } from '../../models/sidebar.menudata';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Input() isCollapsed = false;

  menuItems: SidebarMenuItem[] = SIDEBAR_MENU;

  expandedMenu: string | null = null;
  userRoles: string[] = [];
  userName = '';

  private routerSub?: Subscription;
  private resizeHandler = () => this.checkScreenSize();

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {
    // auto expand đúng menu sau khi login hoặc navigate
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.expandMenuForUrl(event.urlAfterRedirects);
      });

    // chạy luôn cho lần đầu load (F5, login xong)
    this.expandMenuForUrl(this.router.url);

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

  private expandMenuForUrl(url: string) {
    const urlSegment = '/' + url.split('/')[1];
    const user = this.authService.getCurrentUser();
    const khoiId = user?.khoiId;

    const matchedItem = this.menuItems.find((item) =>
      item.children?.some(
        (child) =>
          child.routerLink === urlSegment && (item.khoiId === undefined || item.khoiId === khoiId)
      )
    );

    if (matchedItem) {
      this.expandedMenu = matchedItem.key;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.routerSub?.unsubscribe();
  }

  loadUserProfile() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user?.userName;
      this.userRoles = Array.from(new Set(user.roles));
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

  hasAccess(item: { roles?: string[]; khoiId?: number }): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;

    // check role
    if (item.roles && !item.roles.some((r) => user.roles.includes(r))) {
      return false;
    }

    // check khoiId (so sánh cả khi = 0)
    if (item.khoiId !== undefined && item.khoiId !== user.khoiId) {
      return false;
    }

    return true;
  }
}
