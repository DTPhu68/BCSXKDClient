import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout-shell',
  templateUrl: './layout-shell.component.html',
  styleUrls: ['./layout-shell.component.scss'],
})
export class LayoutShellComponent {
  isSidebarCollapsed = false;
  isLoading = false;
  isLoggedIn = true;

  constructor(private router: Router) {
    if (this.isLoggedIn) {
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        if (window.innerWidth <= 768) {
          this.isSidebarCollapsed = true;
        }
      });
    }
  }

  ngOnInit() {
    // Check initial screen size
    this.checkScreenSize();

    // Listen for window resize
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  private checkScreenSize() {
    if (window.innerWidth <= 768) {
      this.isSidebarCollapsed = true;
    }
  }

  onSidebarCollapsedChange(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
    localStorage.setItem('sidebarCollapsed', collapsed.toString());

    // Trigger window resize event to ensure charts and other components adjust
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300); // Wait for transition to complete
  }

  onSidebarToggled() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
