import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/pages/not-found.component';
import { ServerErrorComponent } from './shared/pages/server-error.component';
import { UnauthorizedComponent } from './shared/pages/unauthorized.component';

const routes: Routes = [
    {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '', loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule) },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
   // 👇 Fallback phải đặt cuối cùng
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
