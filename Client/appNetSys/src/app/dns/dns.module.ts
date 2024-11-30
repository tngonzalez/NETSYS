import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DnsRoutingModule } from './dns-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgIconsModule } from '@ng-icons/core';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../shared/shared.module';
import { DnsCreateComponent } from './dns-create/dns-create.component';
import { DnsDeleteComponent } from './dns-delete/dns-delete.component';
import { DnsIndexComponent } from './dns-index/dns-index.component';
import { DnsDetalleComponent } from './dns-detalle/dns-detalle.component';
import { DnsGeneralComponent } from './dns-general/dns-general.component';

@NgModule({
  declarations: [
    DnsIndexComponent,
    DnsCreateComponent,
    DnsDeleteComponent,
    DnsDetalleComponent,
    DnsGeneralComponent,
  ],
  imports: [
    CommonModule,
    DnsRoutingModule,
    CommonModule,
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
export class DnsModule { }
