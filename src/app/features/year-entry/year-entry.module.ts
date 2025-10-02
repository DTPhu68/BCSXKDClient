import { NgModule } from '@angular/core';

import { YearEntryRoutingModule } from './year-entry-routing.module';
import { YearEntryActionsComponent } from './components/year-entry-actions/year-entry-actions.component';
import { YearEntryGridComponent } from './components/year-entry-grid/year-entry-grid.component';
import { YearEntryPageComponent } from './pages/year-entry-page/year-entry-page.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    YearEntryActionsComponent,
    YearEntryGridComponent,
    YearEntryPageComponent
  ],
  imports: [
    SharedModule,
    YearEntryRoutingModule
  ]
})
export class YearEntryModule { }
