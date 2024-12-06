import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ServiceCreateComponent } from '../service-create/service-create.component';
import { ServiceDeleteComponent } from '../service-delete/service-delete.component';
import { ServiceDetalleComponent } from '../service-detalle/service-detalle.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../shared/generic.service';

@Component({
  selector: 'app-service-index',
  templateUrl: './service-index.component.html',
  styleUrl: './service-index.component.css'
})
export class ServiceIndexComponent implements AfterViewInit {

  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = [
    'id',
    'nombre',
    'accion',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  @ViewChild('serviceFormModal') serviceFormModal!: ServiceCreateComponent;
  @ViewChild('serviceDeleteModal') serviceDeleteModal!: ServiceDeleteComponent;

  constructor(
    private gService: GenericService,
    private route: ActivatedRoute,
    public router: Router) {}
  
  ngAfterViewInit(): void {
    this.serviceDeleteModal.serviceDeleteModal.subscribe(() => {
      this.fetchServicios();
    });
    this.serviceFormModal.serviceCrearModal.subscribe(() => {
      this.fetchServicios();
    });
  }

  ngOnInit(){
    this.fetchServicios();
  }

  fetchServicios() {
    this.gService
      .list('service/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.datos = response;
        this.disableButton(); 
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;  

      });
  }

  
  disableButton() {
    if (this.datos) {
      this.datos.forEach((i: any) => {
        if (i.existClientes === true) {
          i.desactivado = true;
        } else {
          i.desactivado = false;
        }
      });
    }
  }

  crear() {
    this.serviceFormModal.openModal(); 
  }

  update(id: any) {
    this.serviceFormModal.openModal(id);
  }

  deleteservice(id: any) {
    this.serviceDeleteModal.openModal(id);
  }

  redirectDetalle(id: any) {
    this.router.navigate(['/service/', id], {
      relativeTo: this.route,
    }); 
  }

  updateTable(data: any) {
    this.dataSource.data = data;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
