import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login.component';


@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent
    // Thêm các component liên quan đến auth ở đây, ví dụ: RegisterComponent
  ]
})
export class AuthModule { }
