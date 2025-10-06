import { NgModule } from '@angular/core';

import { ToanNganhRoutingModule } from './toan-nganh-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToanNganhShellComponent } from './pages/toan-nganh-shell.component';
import { ToanNganhDashboardComponent } from './pages/toan-nganh-dashboard/toan-nganh-dashboard.component';
import { MonthCheckComponent } from './pages/month-check/month-check.component';
import { YearCheckComponent } from './pages/year-check/year-check.component';



@NgModule({
  declarations: [
    ToanNganhShellComponent,
    ToanNganhDashboardComponent,
    MonthCheckComponent,
    YearCheckComponent
  ],
  imports: [
    SharedModule,
    ToanNganhRoutingModule
  ]
})
export class ToanNganhModule { }
