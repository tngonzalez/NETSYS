import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { GenericService } from '../../shared/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OltCreateComponent } from '../olt-create/olt-create.component';
import { OltDeleteComponent } from '../olt-delete/olt-delete.component';

@Component({
  selector: 'app-olt-index',
  templateUrl: './olt-index.component.html',
  styleUrls: ['./olt-index.component.css'],
})
export class OltIndexComponent implements AfterViewInit {
  selectedStatus: any;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = ['ODF', 'nombreTipo', 'segmentoZona', 'ipGeneral', 'accion'];
  filteredData: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  @ViewChild('oltFormModal') oltFormModal!: OltCreateComponent;
  @ViewChild('oltDeleteModal') oltDeleteModal!: OltDeleteComponent;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private gService: GenericService,
    public router: Router,
    private route: ActivatedRoute
  ){}

  ngAfterViewInit(): void {
    
    this.oltDeleteModal.oltDeleteModal.subscribe(() => {
      this.fetchOLT();
    });

    this.oltFormModal.oltCrear.subscribe(() => {
      this.fetchOLT();
    });
  }

  ngOnInit():void {
    this.fetchOLT();
  }

  fetchOLT() {
    this.gService
    .list('olt/')
    .pipe(takeUntil(this.destroy$))
    .subscribe((response: any) => {
      this.datos = response;
      this.disableButton();
      this.dataSource = new MatTableDataSource(this.datos);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      if(this.searchInput) {
        this.searchInput.nativeElement.value = '';
      }
    });
  }

  //Update by Status
  updateTable(data: any) {
    this.dataSource.data = data;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  disableButton() {
    if (this.datos) {
      this.datos.forEach((i: any) => {
        if (i.existeRouter === true) {
          i.desactivado = true;
        } else {
          i.desactivado = false;
        }
      });
    }
  }

  //Buscar por tipo
  typeChange(event: any) {
    const tipo = event.target.value.trim();
    if (tipo !== '') {
      this.filteredData = this.datos.filter((i: any) =>
        i.nombreTipoOLT && i.nombreTipoOLT.toString().includes(tipo)
      );
    } else {
      this.filteredData = this.datos;
    }

    this.updateTable(this.filteredData);
  }

  crear() {
    this.oltFormModal.openModal();
  }

  update(id: any) {
    this.oltFormModal.openModal(id);
  }

  deleteRouter(id: any) {
    this.oltDeleteModal.openModal(id);
  }

  redirectDetalle(id: any) {
    this.router.navigate(['/olt/', id], {
      relativeTo: this.route,
    });
  }

  redirectGeneral() {
    this.router.navigate(['/olt/general'], {
      relativeTo: this.route,
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
