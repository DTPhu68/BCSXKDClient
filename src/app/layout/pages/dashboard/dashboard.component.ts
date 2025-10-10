import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarMenuItem } from '../../models/sidebar-menu-item.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit{
 khoiMenu?: SidebarMenuItem;

   constructor(private auth: AuthService,private route: ActivatedRoute) {}

   ngOnInit(): void {
    const khoiId = this.route.snapshot.paramMap.get('khoiId');
    console.log('KhoiId from route:', khoiId);
    console.log('Current User:', this.auth.getCurrentUser());
    this.khoiMenu = this.auth.getKhoiMenu();   
    console.log('Khoi Menu:', this.khoiMenu); 
  }
}
