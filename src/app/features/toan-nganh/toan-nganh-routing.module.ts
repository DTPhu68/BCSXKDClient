import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToanNganhShellComponent } from './pages/toan-nganh-shell.component';
import { ToanNganhDashboardComponent } from './pages/toan-nganh-dashboard/toan-nganh-dashboard.component';
import { MonthCheckComponent } from './pages/month-check/month-check.component';
import { YearCheckComponent } from './pages/year-check/year-check.component';

const routes: Routes = [
  {
    path: '',
    component: ToanNganhShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ToanNganhDashboardComponent },
      { path: 'month-check', component: MonthCheckComponent },
      { path: 'year-check', component: YearCheckComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToanNganhRoutingModule {}
