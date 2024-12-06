import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OltCreateComponent } from '../../olt/olt-create/olt-create.component';
import { OltDeleteComponent } from '../../olt/olt-delete/olt-delete.component';
import { GenericService } from '../../shared/generic.service';
import { UserCreateComponent } from '../user-create/user-create.component';
import { UserDeleteComponent } from '../user-delete/user-delete.component';

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrls: ['./user-index.component.css']
})
export class UserIndexComponent implements AfterViewInit {
  selectedStatus: any;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = ['rol', 'nombre', 'correo', 'accion'];
  filteredData: any;
  data:any; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  @ViewChild('userFormModal') userFormModal!: UserCreateComponent;
  @ViewChild('userDeleteModal') userDeleteModal!: UserDeleteComponent;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private gService: GenericService,
    public router: Router,
    private route: ActivatedRoute
  ){}

  ngAfterViewInit(): void {
    
    this.userDeleteModal.userDeleteModal.subscribe(() => {
      this.fetchUser();
    });

    this.userFormModal.userCrear.subscribe(() => {
      this.fetchUser();
    });
  }

  ngOnInit():void {
    this.fetchUser();
  }

  fetchUser() {
    this.gService
      .list('usuario/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        // Asignar datos recibidos
        this.datos = response;
  
        // Agregar la variable 'rol' a cada usuario
        this.datos.forEach((usuario: any) => {
          if (usuario.tipoRol === 1) {
            usuario.rol = "Support - L1";
          } else if (usuario.tipoRol === 2) {
            usuario.rol = "Support - L2";
          }
        });
  
        // Imprimir para depuración
        console.log(this.datos);
  
        // Asignar datos a la fuente de la tabla
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
  

  //Update by Status
  updateTable(data: any) {
    this.dataSource.data = data;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  clientChange(event: any) {
    const cliente = event.target.value.trim().toLowerCase();
    if (cliente !== '') {
      this.filteredData = this.datos.filter(
        (i: any) =>
          i.nombre && i.nombre.toString().toLowerCase().includes(cliente)
      );
    } else {
      this.filteredData = this.datos;
    }

    this.updateTable(this.filteredData);
  }

  crear() {
    this.userFormModal.openModal();
  }

  update(id: any) {
    this.userFormModal.openModal(id);
  }

  delete(id: any) {
    this.userDeleteModal.openModal(id);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
