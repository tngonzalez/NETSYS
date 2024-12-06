import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { UserGuard } from './auth.guard';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule
  ], providers: [AuthService, UserGuard]
})
export class AuthModule { }
