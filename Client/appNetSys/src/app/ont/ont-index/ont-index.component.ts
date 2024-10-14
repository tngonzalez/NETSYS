import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { OntCreateComponent } from '../ont-create/ont-create.component';
import { OntDeleteComponent } from '../ont-delete/ont-delete.component';
import { OntDetalleComponent } from '../ont-detalle/ont-detalle.component';
import { Router } from '@angular/router';
import { GenericService } from '../../shared/generic.service';

@Component({
  selector: 'app-ont-index',
  templateUrl: './ont-index.component.html',
  styleUrls: ['./ont-index.component.css'],
})
export class OntIndexComponent implements AfterViewInit {
  selectedStatus: any;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = ['numActivo', 'macAddress', 'numSN', 'estado', 'accion'];
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
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  @ViewChild('ontFormModal') ontFormModal!: OntCreateComponent;
  @ViewChild('ontDeleteModal') ontDeleteModal!: OntDeleteComponent;
  @ViewChild('ontDetalleModal') ontDetalleModal!: OntDetalleComponent;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private gService: GenericService, public router: Router) {
    this.selectedStatus = 1;
  }

  ngAfterViewInit(): void {
    // this.ontDetalleModal.ontDetalleModal.subscribe(() => {
    //   this.fetchONT();
    // });
    this.ontDeleteModal.ontDeleteModal.subscribe(() => {
      this.fetchONT();
    });
    this.ontFormModal.ontCrear.subscribe(() => {
      this.fetchONT();
    });
  }

  ngOnInit(): void {
    this.fetchONT();
  }

  fetchONT() {
    this.gService
      .list('ont/')
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
        if (i.existeCliente === true) {
          i.desactivado = true;
        } else {
          i.desactivado = false;
        }
      });
    }
  }

  statusChange(value: any, valueDeactivate?: any) {
    switch (value.value) {
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
    const numActivo = event.target.value.trim();
    if (numActivo !== '') {
      this.filteredData = this.datos.filter(
        (i: any) => i.numActivo && i.numActivo.toString().includes(numActivo)
      );
    } else {
      this.filteredData = this.datos;
    }

    this.updateTable(this.filteredData);
  }

  crear() {
    this.ontFormModal.openModal();
  }

  update(id: any) {
    this.ontFormModal.openModal(id);
  }

  deleteONT(id: any) {
    this.ontDeleteModal.openModal(id);
  }

  redirectDetalle(id: any) {
   this.ontDetalleModal.openModal(id);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
