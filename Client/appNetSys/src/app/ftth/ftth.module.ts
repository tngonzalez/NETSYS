import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FtthRoutingModule } from './ftth-routing.module';
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
import { FtthIndexComponent } from './ftth-index/ftth-index.component';
import { FtthCreateComponent } from "./ftth-create/ftth-create.component";
import { FtthDeleteComponent } from './ftth-delete/ftth-delete.component';
import { FtthDetalleComponent } from './ftth-detalle/ftth-detalle.component';
import { FtthUpdateComponent } from './ftth-update/ftth-update.component';
import { MatDialogContent } from '@angular/material/dialog';


@NgModule({
  declarations: [
    FtthIndexComponent,
    FtthCreateComponent,
    FtthDeleteComponent,
    FtthDetalleComponent,
    FtthUpdateComponent
  ],
  imports: [
    CommonModule,
    FtthRoutingModule,
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
export class FtthModule { }
