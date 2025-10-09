import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { MockLoginComponent } from './components/mock-login.component';
import { DevLoginComponent } from './components/dev-login/dev-login.component';
// import { LoginComponent } from './login/login.component'; // Thêm các component khi có

const routes: Routes = [
  { path: '', component: DevLoginComponent },
  //  { path: '', component: MockLoginComponent },
  //  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
