import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  NotificacionService,
  TipoMessage,
} from '../../shared/notificacion.service';

@Component({
  selector: 'app-ftth-estado',
  templateUrl: './ftth-estado.component.html',
  styleUrl: './ftth-estado.component.css',
})
export class FtthEstadoComponent implements OnInit {
  isVisible = false;
  idCliente: any;
  idEstado: any;

  //Retiro
  idEstadoR: any;
  numOSRetiro: any;
  fechaDesinstalacionRetiro: any;
  agenteRetiro: any;

  //Dañado
  dispositivo: any;
  fechaInstalacionDano: any;
  comentarioDano: any;
  direccionActual: any;
  direccionNuevo: any;
  idTipoDano: any;

  //Suspención
  fechaSuspencion: any;

  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  estadoForm!: FormGroup;
  estadoData: any;

  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;
  infoCliente: any;
  displayedRouter: string[] = ['activo', 'serie', 'macAddress', 'accion'];
  displayedONT: string[] = ['numActivo', 'numSN', 'macAdd', 'accion'];

  filteredData: any;
  filteredDataONT: any;

  isRouterS: boolean = false;
  isONTS: boolean = false;

  isTablaRouter: boolean = false;
  isTablaONT: boolean = false;

  router: any[] = [];
  ont: any[] = [];

  dataRouter = new MatTableDataSource<any>();
  dataONT = new MatTableDataSource<any>();

  @Output() ftthEstadoModal: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() ftthCrearModal: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchONTInput') searchONTInput!: ElementRef;
  
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

  retiros = [
    {
      id: 1,
      name: 'Deshabilitado',
    },
    {
      id: 2,
      name: 'Dehabilitación Pendiente',
    },
  ];

  danos = [
    {
      id: 1,
      name: 'Reemplazo',
    },
    {
      id: 2,
      name: 'Avería del cliente',
    },
  ];

  dispositivos = [
    {
      id: 1,
      name: 'ONT',
    },
    {
      id: 2,
      name: 'Router',
    },
  ];

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.estadoReactiveForm();
  }

  estadoReactiveForm() {
    this.estadoForm = this.fb.group({
      idCliente: [null, null],
      idEstado: [null, null],

      //Retiro
      idEstadoR: [null, Validators.required],
      numOSRetiro: [null, Validators.required],
      fechaDesinstalacionRetiro: [null, Validators.required],
      agenteRetiro: [null, Validators.required],

      //Dañado
      dispositivo: [null, Validators.required],
      fechaInstalacionDano: [null, null],
      comentarioDano: [null, null],
      direccionActual: [null, Validators.required],
      direccionNuevo: [null, null],
      idTipoDano: [null, Validators.required],

      //Suspendición
      fechaSuspencion: [null, Validators.required],
    });
  }

  openModal(idCliente: any, idEstado: any) {
    this.isVisible = true;
    this.idCliente = idCliente;
    this.idEstado = idEstado;
    this.loadData(idCliente, idEstado);
  }

  closeModal() {
    this.submitted = true;
    this.estadoForm.reset();
    this.ftthEstadoModal.emit();
    this.isVisible = false;
  }

  loadData(idCliente: any, idEstado: any) {

  }

  createEstado(){

  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.estadoForm.reset();
    this.estadoForm.enable();
  }

  // Control de Errores
  errorHandling(control: string, error: string) {
    return (
      this.estadoForm.controls[control].hasError(error) &&
      (this.estadoForm.controls[control].touched || this.submitted)
    );
  }
}
