import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DnsCreateComponent } from '../dns-create/dns-create.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DnsDeleteComponent } from '../dns-delete/dns-delete.component';
import { DnsDetalleComponent } from '../dns-detalle/dns-detalle.component';
import { GenericService } from '../../shared/generic.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dns-index',
  templateUrl: './dns-index.component.html',
  styleUrl: './dns-index.component.css',
})
export class DnsIndexComponent implements AfterViewInit {
  selectedStatus: any;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = ['usuario', 'macAddress', 'dsn', 'estado', 'accion'];
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

  @ViewChild('dnsFormModal') dnsFormModal!: DnsCreateComponent;
  @ViewChild('dnsDeleteModal') dnsDeleteModal!: DnsDeleteComponent;
  @ViewChild('dnsDetalleModal') dnsDetalleModal!: DnsDetalleComponent;
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private gService: GenericService,
     public router: Router,
     private route: ActivatedRoute

    ) {
    this.selectedStatus = 1;
  }

  ngAfterViewInit(): void {
    this.dnsDeleteModal.dnsDeleteModal.subscribe(() => {
      this.fetchDNS();
    });
    this.dnsFormModal.dnsFormModal.subscribe(() => {
      this.fetchDNS();
    });
  }

  ngOnInit() {
    this.fetchDNS();
  }

  fetchDNS() {
    this.gService
      .list('dns/')
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

  disableButton() {
    if (this.datos) {
      this.datos.forEach((i: any) => {
        if (i.existIPTV === true) {
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
      const cliente = event.target.value.trim().toLowerCase();
      if (cliente !== '') {
        this.filteredData = this.datos.filter(
          (i: any) =>
            i.usuario &&
            i.usuario.toString().toLowerCase().includes(cliente)
        );
      } else {
        this.filteredData = this.datos;
      }
  
      this.updateTable(this.filteredData);
    }

    crear() {
      this.dnsFormModal.openModal();
    }
  
    update(id: any) {
      this.dnsFormModal.openModal(id);
    }
  
    deleteDNS(id: any) {
      this.dnsDeleteModal.openModal(id);
    }
  
    redirectDetalle(id: any) {
      this.router.navigate(['/dns/', id], {
        relativeTo: this.route,
      });
    }
  
    redirectGeneral() {
      this.router.navigate(['/dns/general'], {
        relativeTo: this.route,
      });
    }
  
    ngOnDestroy() {
      this.destroy$.next(true);
      this.destroy$.unsubscribe();
    }
}
