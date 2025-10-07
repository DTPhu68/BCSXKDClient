import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { UnitListComponent } from './components/units/unit-list/unit-list.component';
import { UnitFormComponent } from './components/units/unit-form/unit-form.component';
import { TargetListComponent } from './components/targets/target-list/target-list.component';
import { TargetFormComponent } from './components/targets/target-form/target-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TargetAddfromFormComponent } from './components/targets/target-addfrom-form/target-addfrom-form.component';



@NgModule({
  declarations: [    
    UserListComponent,
    UserFormComponent,
    UnitListComponent,
    UnitFormComponent,
    TargetListComponent,
    TargetFormComponent,
    TargetAddfromFormComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
