import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Input() isCollapsed = false;

  expandedMenu: string | null = null;
  userRoles: string[] = ['Admin', 'User', 'Manager'];
  userName = 'Nguyen Van A';

  constructor(private router: Router) {
    // Reset expanded menu on route change
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (window.innerWidth <= 768) {
        this.isCollapsed = true;
      }
    });
  }

  ngOnInit() {
    this.loadUserProfile();
    this.checkScreenSize();

    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  loadUserProfile() {
    // Logic to load user profile
  }

  checkScreenSize() {
    if (window.innerWidth <= 768) {
      this.isCollapsed = true;
      this.collapsedChange.emit(true);
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  toggleSubmenu(menu: string) {
    if (this.isCollapsed) {
      this.isCollapsed = false;
      this.collapsedChange.emit(false);
      this.expandedMenu = menu;
    } else {
      this.expandedMenu = this.expandedMenu === menu ? null : menu;
    }
  }
}
