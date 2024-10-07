import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RtrIndexComponent } from './rtr/rtr-index/rtr-index.component';
import { MainMenuComponent } from './main/main-menu/main-menu.component';
import { DashboardIndexComponent } from './dashboard/dashboard-index/dashboard-index.component';
import { OltIndexComponent } from './olt/olt-index/olt-index.component';
import { FtthIndexComponent } from './ftth/ftth-index/ftth-index.component';
import { ServiceIndexComponent } from './service/service-index/service-index.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' }, //Dashboard por defecto
  {path: 'main', component: MainMenuComponent },
  { path: 'rtr', component: RtrIndexComponent },
  { path: 'dashboard', component: DashboardIndexComponent },
  {path: 'ftth', component: FtthIndexComponent},
  { path: 'olt', component: OltIndexComponent },
  { path: 'service', component: ServiceIndexComponent },


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
