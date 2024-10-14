import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';
import { RtrRoutingModule } from './rtr-routing.module';
import { RtrIndexComponent } from './rtr-index/rtr-index.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { RtrCreateComponent } from './rtr-create/rtr-create.component';
import { RtrDeleteComponent } from './rtr-delete/rtr-delete.component';
import { RtrDetalleComponent } from './rtr-detalle/rtr-detalle.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    RtrIndexComponent,
    RtrCreateComponent,
    RtrDeleteComponent,
    RtrDetalleComponent,
  ],
  imports: [
    CommonModule,
    RtrRoutingModule,
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
    NgIconsModule.withIcons({})
  ],
})
export class RtrModule { }
