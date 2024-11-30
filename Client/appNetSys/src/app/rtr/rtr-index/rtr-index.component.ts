import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Subject } from 'rxjs/internal/Subject';
import { GenericService } from '../../shared/generic.service';
import { takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RtrCreateComponent } from '../rtr-create/rtr-create.component';
import { RtrDetalleComponent } from '../rtr-detalle/rtr-detalle.component';
import { RtrDeleteComponent } from '../rtr-delete/rtr-delete.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rtr-index',
  templateUrl: './rtr-index.component.html',
  styleUrls: ['./rtr-index.component.css'],
})
export class RtrIndexComponent implements AfterViewInit {
  selectedStatus: any;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = ['activo', 'serie', 'macAddress', 'estado', 'accion'];
  filteredData: any;

  statuses = [
    { id: 0, name: 'Estado' },
    {
      id: 1,
      name: 'Disponible',
    },
    {
      id: 2,
      name: 'Asignado',
    },
    {
      id: 3,
      name: 'Dañado',
    },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  @ViewChild('routerFormModal') routerFormModal!: RtrCreateComponent;
  @ViewChild('routerDeleteModal') routerDeleteModal!: RtrDeleteComponent;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private gService: GenericService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.selectedStatus = 1;
  }

  ngAfterViewInit(): void {
    this.routerDeleteModal.routerDeleteModal.subscribe(() => {
      this.fetchRouter();
    });

    this.routerFormModal.routerCrear.subscribe(() => {
      this.fetchRouter();
    });
  }

  ngOnInit(): void {
    this.fetchRouter();
  }

  fetchRouter() {
    this.gService
      .list('rcasa/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.datos = response;
        this.disableButton();
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        if (this.searchInput) {
          this.searchInput.nativeElement.value = '';
        }
      });
  }

  //Disable button
  disableButton() {
    if (this.datos) {
      this.datos.forEach((i: any) => {
        if (i.idEstado !== 1) {
          i.desactivado = true;
        } else {
          i.desactivado = false;
        }
      });
    }
  }

  statusChange(value: any, valueDeactivate?: any) {
    switch (value.value) {
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

  //Update by Status
  updateTable(data: any) {
    this.dataSource.data = data;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  //Update By NumActivo
  numberChange(event: any) {
    const activo = event.target.value.trim();
    if (activo !== '') {
      this.filteredData = this.datos.filter(
        (i: any) => i.activo && i.activo.toString().includes(activo)
      );
    } else {
      this.filteredData = this.datos;
    }

    this.updateTable(this.filteredData);
  }

  crear() {
    this.routerFormModal.openModal();
  }

  update(id: any) {
    this.routerFormModal.openModal(id);
  }

  deleteRouter(id: any) {
    this.routerDeleteModal.openModal(id);
  }

  redirectDetalle(id: any) {
    this.router.navigate(['/rtr/', id], {
      relativeTo: this.route,
    });
  }

  redirectGeneral() {
    this.router.navigate(['/rtr/general'], {
      relativeTo: this.route,
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
