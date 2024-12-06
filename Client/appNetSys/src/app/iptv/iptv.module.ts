import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IptvRoutingModule } from './iptv-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgIconsModule } from '@ng-icons/core';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../shared/shared.module';
import { IptvIndexComponent } from './iptv-index/iptv-index.component';
import { IptvCreateComponent } from './iptv-create/iptv-create.component';
import { IptvDeleteComponent } from './iptv-delete/iptv-delete.component';
import { IptvDetalleComponent } from './iptv-detalle/iptv-detalle.component';
import { IptvGeneralComponent } from './iptv-general/iptv-general.component';
import { MatDialogContent } from '@angular/material/dialog';


@NgModule({
  declarations: [
    IptvIndexComponent,
    IptvCreateComponent,
    IptvDeleteComponent,
    IptvDetalleComponent,
    IptvGeneralComponent,
  ],
  imports: [
    CommonModule,
    IptvRoutingModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatFormFieldModule,
    MatSelectModule,
    NgIconsModule.withIcons({}),
    MatDialogContent
  ]
})
export class IptvModule { }
