import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from "@angular/common";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';

import { CanGuard } from './authentication/guards/can-guard';
import { CanAdminGuard } from './authentication/guards/can-admin-guard';
import { HttpClientModule } from '@angular/common/http';
import { SalaComponent } from './sala/sala.component';
import { ReservarComponent } from './reservar/reservar.component';
import { SalasComponent } from './admin/salas/salas.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    NavbarComponent,
    ToolbarComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    SalaComponent,
    ReservarComponent,
    SalasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  providers: [
    CanGuard,
    CanAdminGuard,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
