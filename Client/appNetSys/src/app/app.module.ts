import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { FttchModule } from "./fttch/fttch.module";
import { RtrModule } from "./rtr/rtr.module";
import { HttpClientModule } from "@angular/common/http";
import { OltModule } from './olt/olt.module';
import { MainModule } from './main/main.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FtthModule } from './ftth/ftth.module';



@NgModule ({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    FttchModule,
    RtrModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    OltModule,
    MainModule,
    DashboardModule,
    FtthModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
