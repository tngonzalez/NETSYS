import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OltRoutingModule } from './olt-routing.module';
import { OltIndexComponent } from './olt-index/olt-index.component';
import { OltCreateComponent } from './olt-create/olt-create.component';
import { OltDeleteComponent } from './olt-delete/olt-delete.component';
import { OltDetalleComponent } from './olt-detalle/olt-detalle.component';
import { OltGeneralComponent } from './olt-general/olt-general.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgIconsModule } from '@ng-icons/core';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    OltIndexComponent,
    OltCreateComponent,
    OltDeleteComponent,
    OltDetalleComponent,
    OltGeneralComponent,
  ],
  imports: [
    CommonModule,
    OltRoutingModule,
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
  ]
})
export class OltModule { }
