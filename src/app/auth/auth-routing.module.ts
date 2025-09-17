import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
// import { LoginComponent } from './login/login.component'; // Thêm các component khi có

const routes: Routes = [
   { path: '', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
