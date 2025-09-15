import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() isSidebarCollapsed = false;
  currentYear: number = new Date().getFullYear();
  // version: string = environment.version;
  version: string = '1.0.0';
}
