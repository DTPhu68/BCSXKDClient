import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthEntryPageComponent } from './pages/month-entry-page/month-entry-page.component';

const routes: Routes = [{ path: '', component: MonthEntryPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthEntryRoutingModule { }
