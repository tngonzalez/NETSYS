import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RtrIndexComponent } from './rtr/rtr-index/rtr-index.component';
import { MainMenuComponent } from './main/main-menu/main-menu.component';
import { DashboardIndexComponent } from './dashboard/dashboard-index/dashboard-index.component';
import { OltIndexComponent } from './olt/olt-index/olt-index.component';
import { FtthIndexComponent } from './ftth/ftth-index/ftth-index.component';
import { ServiceIndexComponent } from './service/service-index/service-index.component';
import { OntIndexComponent } from './ont/ont-index/ont-index.component';
import { IptvIndexComponent } from './iptv/iptv-index/iptv-index.component';
import { DnsIndexComponent } from './dns/dns-index/dns-index.component';
import { OltDetalleComponent } from './olt/olt-detalle/olt-detalle.component';
import { OltGeneralComponent } from './olt/olt-general/olt-general.component';
import { RtrDetalleComponent } from './rtr/rtr-detalle/rtr-detalle.component';
import { RtrGeneralComponent } from './rtr/rtr-general/rtr-general.component';
import { OntGeneralComponent } from './ont/ont-general/ont-general.component';
import { OntDetalleComponent } from './ont/ont-detalle/ont-detalle.component';
import { DnsGeneralComponent } from './dns/dns-general/dns-general.component';
import { DnsDetalleComponent } from './dns/dns-detalle/dns-detalle.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' }, //Dashboard por defecto
  {path: 'main', component: MainMenuComponent },
  { path: 'rtr', component: RtrIndexComponent },
  { path: 'dashboard', component: DashboardIndexComponent },
  {path: 'ftth', component: FtthIndexComponent},
  { path: 'olt', component: OltIndexComponent },
  { path: 'service', component: ServiceIndexComponent },
  { path: 'ont', component: OntIndexComponent },
  { path: 'iptv', component: IptvIndexComponent },
  { path: 'dns', component: DnsIndexComponent },

  //Reportes 
  { path: 'olt/general', component: OltGeneralComponent },
  { path: 'olt/:id', component: OltDetalleComponent },

  { path: 'rtr/general', component: RtrGeneralComponent },
  { path: 'rtr/:id', component: RtrDetalleComponent},

  { path: 'ont/general', component: OntGeneralComponent },
  { path: 'ont/:id', component: OntDetalleComponent},

  { path: 'dns/general', component: DnsGeneralComponent },
  { path: 'dns/:id', component: DnsDetalleComponent},


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
