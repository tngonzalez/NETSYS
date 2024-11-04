import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FtthCreateComponent } from '../ftth-create/ftth-create.component';
import { FtthDeleteComponent } from '../ftth-delete/ftth-delete.component';
import { FtthDetalleComponent } from '../ftth-detalle/ftth-detalle.component';
import { Router } from '@angular/router';
import { GenericService } from '../../shared/generic.service';
import { FtthEstadoComponent } from '../ftth-estado/ftth-estado.component';

@Component({
  selector: 'app-ftth-index',
  templateUrl: './ftth-index.component.html',
  styleUrls: ['./ftth-index.component.css'],
})
export class FtthIndexComponent implements AfterViewInit {
  selectedStatus: any;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = [
    'fechaInstalacion',
    'tipoCliente',
    'cliente',
    'agente',
    'accion',
  ];
  filteredData: any;

  statuses = [
    { id: 0, name: 'Estado' },
    {
      id: 1,
      name: 'Activo',
    },
    {
      id: 2,
      name: 'Desactivado: Suspención',
    },
    {
      id: 3,
      name: 'Desactivado: Retiro',
    },
    {
      id: 4,
      name: 'Desactivado: Dañado',
    },
  ];

  servicios: any[] = [];
  selectedService: string | null = "Servicios";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  @ViewChild('ftthFormModal') ftthFormModal!: FtthCreateComponent;
  @ViewChild('ftthDeleteModal') ftthDeleteModal!: FtthDeleteComponent;
  @ViewChild('ftthDetalleModal') ftthDetalleModal!: FtthDetalleComponent;
  @ViewChild('ftthEstadoModal') ftthEstadoModal!: FtthEstadoComponent;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private gService: GenericService, public router: Router) {
    this.selectedStatus = 1;
  }

  ngAfterViewInit(): void {
    this.ftthDeleteModal.ftthDeleteModal.subscribe(() => {
      this.fetchFtth();
      this.fetchServicios();
    });
    this.ftthDetalleModal.ftthDetalleModal.subscribe(() => {
      this.fetchFtth();
      this.fetchServicios();
    });
    this.ftthFormModal.ftthCrearModal.subscribe(() => {
      this.fetchFtth();
      this.fetchServicios();
    });
    this.ftthEstadoModal.ftthEstadoModal.subscribe(() => {
      this.fetchFtth();
      this.fetchServicios();
    });
  }

  ngOnInit() {
    this.fetchFtth();
    this.fetchServicios();
  }

  fetchFtth() {
    this.gService
      .list('ftth/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.datos = response;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        if (this.searchInput) {
          this.searchInput.nativeElement.value = '';
        }
      });
  }

  fetchServicios() {
    this.gService
      .list('service/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.servicios = response;

        this.servicios.unshift({nombre: 'Servicios'}); 
      });
  }

  statusChange(value: any, valueDeactivate?: any) {
    switch (value.value) {
      case '4': {
        this.filteredData = this.datos.filter(
          (data: any) => data.idEstado === 4
        );
        this.updateTable(this.filteredData);
        break;
      }
      case '3': {
        this.filteredData = this.datos.filter(
          (data: any) => data.idEstado === 3
        );
        this.updateTable(this.filteredData);
        break;
      }
      case '2': {
        this.filteredData = this.datos.filter(
          (data: any) => data.idEstado === 2
        );
        this.updateTable(this.filteredData);
        break;
      }
      case '1': {
        this.filteredData = this.datos.filter(
          (data: any) => data.idEstado === 1
        );
        this.updateTable(this.filteredData);
        break;
      }
      default: {
        this.updateTable(this.datos);
        break;
      }
    }
  }

  //Buscar por cliente
  clientChange(event: any) {
    const cliente = event.target.value.trim().toLowerCase();
    if (cliente !== '') {
      this.filteredData = this.datos.filter(
        (i: any) =>
          i.cliente && i.cliente.toString().toLowerCase().includes(cliente)
      );
    } else {
      this.filteredData = this.datos;
    }

    this.updateTable(this.filteredData);
  }


  //Dropdown services
  servicesChange(event: any) {

    const selectedService = event;

    if (selectedService === 'Servicios') {

      this.filteredData = this.datos;
    } else {
      this.filteredData = this.datos.filter(
        (i: any) => i.tipoCliente && i.tipoCliente.toString() === event
      );
    }
    this.updateTable(this.filteredData);
  }

  //Update by Status
  updateTable(data: any) {
    this.dataSource.data = data;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  crear() {
    this.ftthFormModal.openModal(); 
  }

  update(id: any) {
    this.ftthFormModal.openModal(id);
  }

  estadoChange(idCliente: any, idEstado: any) {
    this.ftthEstadoModal.openModal(idCliente, idEstado);
  }

  deleteFtth(id: any) {
    this.ftthDeleteModal.openModal(id);
  }

  redirectDetalle(id: any) {
    this.ftthDetalleModal.openModal(id);
  }

  redirectService() {
    this.router.navigate(['service/']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
