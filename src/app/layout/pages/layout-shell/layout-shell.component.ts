import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-layout-shell',
  templateUrl: './layout-shell.component.html',
  styleUrls: ['./layout-shell.component.scss'],
})
export class LayoutShellComponent {
  isSidebarCollapsed = false;
  showScrollTop = false;
  isLoading = false;
  isLoggedIn = true;

  private routerSub?: Subscription;
  private resizeHandler = () => this.checkScreenSize();

  constructor(private router: Router) {}

  ngOnInit() {
    // Load trạng thái sidebar từ localStorage (nếu có)
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      this.isSidebarCollapsed = saved === 'true';
    }

    // Check initial screen size
    this.checkScreenSize();

    // Listen for window resize
    window.addEventListener('resize', this.resizeHandler);

    // Collapse sidebar tự động khi navigate trên mobile
    if (this.isLoggedIn) {
      this.routerSub = this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          if (window.innerWidth <= 768) {
            this.isSidebarCollapsed = true;
            localStorage.setItem('sidebarCollapsed', 'true');
          }
        });
    }
    // Lắng nghe scroll để toggle nút
    window.addEventListener('scroll', this.onWindowScroll);
  }

  ngOnDestroy(): void {
    // Cleanup event listeners và subscription
    window.removeEventListener('resize', this.resizeHandler);
    this.routerSub?.unsubscribe();
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  private checkScreenSize() {
    if (window.innerWidth <= 768) {
      this.isSidebarCollapsed = true;
      localStorage.setItem('sidebarCollapsed', 'true');
    }
  }

  onSidebarCollapsedChange(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
    localStorage.setItem('sidebarCollapsed', collapsed.toString());

    // Trigger window resize event để chart/table redraw
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300); // Wait for transition
  }

  onSidebarToggled() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', this.isSidebarCollapsed.toString());
  }

  private onWindowScroll = () => {
    this.showScrollTop = window.scrollY > 200;
  };
  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
