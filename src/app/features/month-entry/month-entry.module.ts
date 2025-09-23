import { NgModule } from '@angular/core';
import { MonthEntryRoutingModule } from './month-entry-routing.module';
import { MonthEntryPageComponent } from './pages/month-entry-page/month-entry-page.component';
import { MonthEntryGridComponent } from './components/month-entry-grid/month-entry-grid.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MonthEntryActionsComponent } from './components/month-entry-actions/month-entry-actions.component';


@NgModule({
  declarations: [    
    MonthEntryPageComponent,
    
    MonthEntryGridComponent,
    MonthEntryActionsComponent
  ],
  imports: [
    SharedModule,
    MonthEntryRoutingModule
  ]
})
export class MonthEntryModule { }
