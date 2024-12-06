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
import { ServiceDetalleComponent } from './service/service-detalle/service-detalle.component';
import { FtthDetalleComponent } from './ftth/ftth-detalle/ftth-detalle.component';
import { FtthGeneralComponent } from './ftth/ftth-general/ftth-general.component';
import { FtthCondominioComponent } from './ftth/ftth-condominio/ftth-condominio.component';
import { FtthHistorialEstadoComponent } from './ftth/ftth-historial-estado/ftth-historial-estado.component';
import { IptvDetalleComponent } from './iptv/iptv-detalle/iptv-detalle.component';
import { IptvGeneralComponent } from './iptv/iptv-general/iptv-general.component';
import { UserIndexComponent } from './user/user-index/user-index.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { LogoutComponent } from './shared/logout/logout.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta predeterminada
  { path: 'login', component: UserLoginComponent },

  {path: 'main', component: MainMenuComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'rtr', component: RtrIndexComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'dashboard', component: DashboardIndexComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  {path: 'ftth', component: FtthIndexComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'olt', component: OltIndexComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'service', component: ServiceIndexComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'ont', component: OntIndexComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'iptv', component: IptvIndexComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'dns', component: DnsIndexComponent,
     canActivate: [AuthGuard], data:{rol:[1,2]}
  },

  { path: 'usuario', component: UserIndexComponent,
    canActivate: [AuthGuard], data:{rol:[1]}
  },

  //Reportes 
  { path: 'olt/general', component: OltGeneralComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'olt/:id', component: OltDetalleComponent, 
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },

  { path: 'rtr/general', component: RtrGeneralComponent, 
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'rtr/:id', component: RtrDetalleComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },

  { path: 'ont/general', component: OntGeneralComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'ont/:id', component: OntDetalleComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },

  { path: 'dns/general', component: DnsGeneralComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'dns/:id', component: DnsDetalleComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },

  { path: 'service/:id', component: ServiceDetalleComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },

  { path: 'ftth/general', component: FtthGeneralComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
},
  { path: 'ftth/:id', component: FtthDetalleComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },

  { path: 'ftth/condominio/:id', component: FtthCondominioComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'ftth/historial/:id', component: FtthHistorialEstadoComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },

  { path: 'iptv/general', component: IptvGeneralComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },
  { path: 'iptv/:id', component: IptvDetalleComponent,
    canActivate: [AuthGuard], data:{rol:[1,2]}
  },

  { path: 'logout', component: LogoutComponent},

  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
