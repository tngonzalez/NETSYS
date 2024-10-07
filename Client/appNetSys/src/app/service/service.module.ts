import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ServiceIndexComponent } from './service-index/service-index.component';
import { ServiceCreateComponent } from './service-create/service-create.component';
import { ServiceDeleteComponent } from './service-delete/service-delete.component';
import { ServiceDetalleComponent } from './service-detalle/service-detalle.component';
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


@NgModule({
  declarations: [
    ServiceIndexComponent,
    ServiceCreateComponent,
    ServiceDeleteComponent,
    ServiceDetalleComponent
  ],
  imports: [
    CommonModule,
    ServiceRoutingModule,
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
export class ServiceModule { }
