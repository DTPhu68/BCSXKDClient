import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UnitListComponent } from './components/units/unit-list/unit-list.component';
import { TargetListComponent } from './components/targets/target-list/target-list.component';

const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'units', component: UnitListComponent },
  { path: 'targets', component: TargetListComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
