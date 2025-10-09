import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login.component';
import { MockLoginComponent } from './components/mock-login.component';
import { ChangePwdModalComponent } from './components/change-pwd-modal/change-pwd-modal.component';
import { DevLoginComponent } from './components/dev-login/dev-login.component';


@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    MockLoginComponent,
    ChangePwdModalComponent,
    DevLoginComponent
    // Thêm các component liên quan đến auth ở đây, ví dụ: RegisterComponent
  ]
})
export class AuthModule { }
