import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutShellComponent } from './pages/layout-shell/layout-shell.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutShellComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      {
        path: 'month-entries/:khoiId',
        loadChildren: () =>
          import('../features/month-entry/month-entry.module').then((m) => m.MonthEntryModule),
      },
      {
        path: 'year-entries/:khoiId',
        loadChildren: () =>
          import('../features/year-entry/year-entry.module').then((m) => m.YearEntryModule),
      },
      {
        path: 'admin',
        loadChildren: () => import('../features/admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'toan-nganh',
        loadChildren: () =>
          import('../features/toan-nganh/toan-nganh.module').then((m) => m.ToanNganhModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
