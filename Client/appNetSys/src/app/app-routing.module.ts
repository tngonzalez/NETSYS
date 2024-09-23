import { RouterModule, Routes } from '@angular/router';
import { FttchModule } from './fttch/fttch.module';
import { NgModule } from '@angular/core';
import { RtrIndexComponent } from './rtr/rtr-index/rtr-index.component';
import { MainMenuComponent } from './main/main-menu/main-menu.component';
import { DashboardIndexComponent } from './dashboard/dashboard-index/dashboard-index.component';
import { OltIndexComponent } from './olt/olt-index/olt-index.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' }, //Dashboard por defecto
  {path: 'main', component: MainMenuComponent },
  { path: 'rtr', component: RtrIndexComponent },
  { path: 'dashboard', component: DashboardIndexComponent },
 //{path: 'ftth', component: FttchModule},
  { path: 'olt', component: OltIndexComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
