import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FtthCreateComponent } from '../ftth-create/ftth-create.component';
import { FtthUpdateComponent } from '../ftth-update/ftth-update.component';
import { FtthDeleteComponent } from '../ftth-delete/ftth-delete.component';
import { FtthDetalleComponent } from '../ftth-detalle/ftth-detalle.component';
import { Router } from '@angular/router';
import { GenericService } from '../../shared/generic.service';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  @ViewChild('ftthFormModal') ftthFormModal!: FtthCreateComponent;
  @ViewChild('ftthUpdateModal') ftthUpdateModal!: FtthUpdateComponent;
  @ViewChild('ftthDeleteModal') ftthDeleteModal!: FtthDeleteComponent;
  @ViewChild('ftthDetalleModal') ftthDetalleModal!: FtthDetalleComponent;
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private gService: GenericService, public router: Router) {
    this.selectedStatus = 1;
  }

  ngAfterViewInit(): void {
    this.ftthDeleteModal.ftthDeleteModal.subscribe(() => {
      this.fetchFtth();
      this.fetchServicios();
    });
    this.ftthUpdateModal.ftthUpdateModal.subscribe(() => {
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
        console.log(this.datos);
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
        console.log(this.servicios);
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

  selectedService: string | null = null;

  //Dropdown services
  servicesChange(event: Event) {
    console.log(event); 
    if (event) {
      this.filteredData = this.datos.filter(
        (i: any) => i.tipoCliente && i.tipoCliente.toString() === event
      );
    } else {
      this.filteredData = this.datos;
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
    this.ftthUpdateModal.openModal(id);
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
