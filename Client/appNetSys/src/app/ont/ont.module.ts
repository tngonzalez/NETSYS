import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OntRoutingModule } from './ont-routing.module';
import { OntIndexComponent } from './ont-index/ont-index.component';
import { OntCreateComponent } from './ont-create/ont-create.component';
import { OntDeleteComponent } from './ont-delete/ont-delete.component';
import { OntDetalleComponent } from './ont-detalle/ont-detalle.component';
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


@NgModule({
  declarations: [
    OntIndexComponent,
    OntCreateComponent,
    OntDeleteComponent,
    OntDetalleComponent
  ],
  imports: [
    CommonModule,
    OntRoutingModule,
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
export class OntModule { }
