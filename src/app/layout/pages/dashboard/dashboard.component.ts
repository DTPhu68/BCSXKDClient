import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarMenuItem } from '../../models/sidebar-menu-item.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit{
 khoiMenu?: SidebarMenuItem;

   constructor(private auth: AuthService) {}

   ngOnInit(): void {
    this.khoiMenu = this.auth.getKhoiMenu();    
  }
}
