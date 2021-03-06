import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { SalaComponent } from './sala/sala.component';
import { SalasComponent } from './admin/salas/salas.component';

import { CanGuard } from './authentication/guards/can-guard';
import { CanAdminGuard } from './authentication/guards/can-admin-guard';

const routes: Routes = [
  {path: 'salas', component: SalasComponent, canActivate: [CanAdminGuard]},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'sala/:id', component: SalaComponent, canActivate: [CanGuard]},
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: '**', pathMatch: 'full', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
