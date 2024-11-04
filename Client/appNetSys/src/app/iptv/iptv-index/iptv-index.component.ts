import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { GenericService } from "../../shared/generic.service";
import { SharedModule } from "../../shared/shared.module";
import { IptvCreateComponent } from "../iptv-create/iptv-create.component";
import { IptvDeleteComponent } from "../iptv-delete/iptv-delete.component";
import { IptvDetalleComponent } from "../iptv-detalle/iptv-detalle.component";

@Component({
  selector: 'app-iptv-index',
  templateUrl: './iptv-index.component.html',
  styleUrls: ['./iptv-index.component.css'],
})
export class IptvIndexComponent implements AfterViewInit {
  selectedStatus: any;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = [
    'fechaInstalacion',
    'numCliente',
    'nombreCliente',
    'estado',
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  @ViewChild('iptvFormModal') iptvFormModal!: IptvCreateComponent;
  @ViewChild('iptvDeleteModal') iptvDeleteModal!: IptvDeleteComponent;
  @ViewChild('iptvDetalleModal') iptvDetalleModal!: IptvDetalleComponent;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private gService: GenericService, public router: Router) {
    this.selectedStatus = 1;
  }

  ngAfterViewInit(): void {

    this.iptvFormModal.iptvCrear.subscribe(() => {
      this.fetchIPTV();
    });

    this.iptvDeleteModal.iptvDeleteModal.subscribe(() => {
      this.fetchIPTV();
    });

    // this.iptvDetalleModal.iptvDetalleModal.subscribe(() => {
    //   this.fetchIPTV();
    // });
  }

  ngOnInit(): void {
    this.fetchIPTV();
  }

  fetchIPTV() {
    this.gService
      .list('iptv/')
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

  //Buscar por cliente
  clientChange(event: any) {
    const cliente = event.target.value.trim().toLowerCase();
    if (cliente !== '') {
      this.filteredData = this.datos.filter(
        (i: any) =>
          i.nombreCliente &&
          i.nombreCliente.toString().toLowerCase().includes(cliente)
      );
    } else {
      this.filteredData = this.datos;
    }

    this.updateTable(this.filteredData);
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

  //Update by Status
  updateTable(data: any) {
    this.dataSource.data = data;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  disableButton(){
    if(this.datos) {
       this.datos.forEach((i: any) => {
        if(i.idEstado !== 1) {
          i.desactivado = true;
        } else {
          i.desactivado = false;
        }
       });
    }
  }

  crear(){
    this.iptvFormModal.openModal();
   }

  update(id:any){
    this.iptvFormModal.openModal(id);
  }

  deleteIPTV(id:any){
    this.iptvDeleteModal.openModal(id);
  }

  redirectDetalle(id:any){}

  redirectDNS(){
    this.router.navigate(['dns/']); 
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
