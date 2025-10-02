import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YearEntryPageComponent } from './pages/year-entry-page/year-entry-page.component';

const routes: Routes = [{ path: '', component: YearEntryPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YearEntryRoutingModule {}
