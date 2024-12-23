import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { RtrModule } from "./rtr/rtr.module";
import { HttpClientModule } from "@angular/common/http";
import { OltModule } from './olt/olt.module';
import { MainModule } from './main/main.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FtthModule } from './ftth/ftth.module';
import { ServiceModule } from './service/service.module';
import 'flowbite';
import { OntModule } from './ont/ont.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { IptvModule } from './iptv/iptv.module';
import { DnsModule } from './dns/dns.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'; 

@NgModule ({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    RtrModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    OltModule,
    MainModule,
    DashboardModule,
    FtthModule,
    ServiceModule,
    OntModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IptvModule,
    DnsModule,
    UserModule,
    AuthModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
