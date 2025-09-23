import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NotFoundComponent } from './pages/not-found.component';
import { ServerErrorComponent } from './pages/server-error.component';
import { UnauthorizedComponent } from './pages/unauthorized.component';
import { ViDecimalValueAccessor } from './directives/vi-decimal.value-accessor';

@NgModule({
  declarations: [
    NotFoundComponent,
    ServerErrorComponent,
    UnauthorizedComponent,
     ViDecimalValueAccessor,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,    
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    BsDropdownModule,
    TooltipModule,
    ModalModule,
    PaginationModule,
    NotFoundComponent,
    ServerErrorComponent,
    UnauthorizedComponent,
     ViDecimalValueAccessor,
  ],
})
export class SharedModule {}
