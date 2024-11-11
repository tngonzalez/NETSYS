import {
  AfterViewInit,
  ChangeDetectorRef,
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
  styleUrls: ['./ftth-estado.component.css'],
})
export class FtthEstadoComponent implements OnInit {
  isVisible = false;
  id: any; //id del estado
  idCliente: any;
  idEstado: any;

  //Unicamente se utilizarán
  ontMACAdd: any;
  routerMACAdd: any;

  //Retiro
  idEstadoR: any;
  numOSRetiro: any;
  fechaDesinstalacionRetiro: any;
  agenteRetiro: any;
  comentarioRetiro: any;

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
      id: 0,
      name: 'Dispositivos',
    },
    {
      id: 1,
      name: 'ONT',
    },
    {
      id: 2,
      name: 'Router',
    },
  ];

  isCreate: boolean = true;

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService,
    private cdRef: ChangeDetectorRef
  ) {
    this.estadoReactiveForm();
  }

  ngOnInit(): void {
    this.fetchONT();
    this.fetchRouter();
  }

  estadoReactiveForm() {
    this.estadoForm = this.fb.group({
      //id del Estado
      id: [null, null],

      idCliente: [null, null],

      //Id del tipo de estado
      idEstado: [null, null],

      //Retiro
      idEstadoR: [null, Validators.required],
      numOSRetiro: [null, Validators.required],
      fechaDesinstalacionRetiro: [null, null],
      agenteRetiro: [null, null],
      comentarioRetiro: [null, null],

      //Dañado
      dispositivo: [null, Validators.required],
      fechaInstalacionDano: [null, null],
      comentarioDano: [null, null],
      direccionActual: [null],
      direccionNuevo: [null],
      idTipoDano: [null, Validators.required],

      //Suspendición
      fechaSuspencion: [null, Validators.required],
    });
  }

  openModal(idCliente: any, idEstado: any, ontMAC: any, routerMAC: any) {
    this.isVisible = true;
    this.idCliente = idCliente;
    this.idEstado = idEstado;

    this.ontMACAdd = ontMAC;
    this.routerMACAdd = routerMAC;

    console.log(this.ontMACAdd, this.routerMACAdd);

    this.estadoForm.get('direccionActual')?.disable();
    this.estadoForm.get('direccionNuevo')?.disable();

    if (idEstado === 1) {
      this.estadoReactiveForm;
      this.isCreate = true;
      this.estadoForm.patchValue({
        idEstado: idEstado,
      });

      this.estadoForm.get('idEstadoR')?.setValue(this.retiros[0].id);
      this.estadoForm.get('dispositivo')?.setValue(this.dispositivos[0].name);
      this.estadoForm.get('idTipoDano')?.setValue(this.danos[0].id);
    } else {
      this.loadData(idCliente, idEstado);
      this.isCreate = false;
    }
  }

  closeModal() {
    this.submitted = false;

    this.estadoForm.reset();
    this.ftthEstadoModal.emit();
    this.isTablaRouter = false;
    this.isTablaONT = false;
    this.isCreate = true;
    this.isVisible = false;
  }

  loadData(idCliente: any, idEstado: any) {
    this.isCreate = false;
    const data = {
      idCliente: idCliente,
      idEstado: idEstado,
    };

    this.gService
      .create('ftth/estado', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.estadoData = data;
        console.log(data);

        this.estadoForm.patchValue({
          idEstado: idEstado,
        });
        if (idEstado === 2) {
          this.estadoForm.patchValue({
            id: this.estadoData.idSuspencion,
            idCliente: this.estadoData.idCliente,
            fechaSuspencion: this.estadoData.fechaSuspencion,
          });
        } else if (idEstado == 3) {
          this.estadoForm.patchValue({
            id: this.estadoData.idRetiro,
            idCliente: this.estadoData.idCliente,
            idEstadoR: this.estadoData.idEstadoR,
            numOSRetiro: this.estadoData.numOS,
            fechaDesinstalacionRetiro: this.estadoData.fechaDesinstalacion,
            comentarioRetiro: this.estadoData.comentario,
            agenteRetiro: this.estadoData.agente,
          });
        } else if (idEstado == 4) {
          this.estadoForm.patchValue({
            id: this.estadoData.idDanado,
            idCliente: this.estadoData.idCliente,
            fechaInstalacionDano: this.estadoData.fechaInstalacion,
            dispositivo: this.estadoData.dispositivo,
            direccionActual: this.estadoData.direccionActual,
            direccionNuevo: this.estadoData.direccionNueva,
            comentarioDano: this.estadoData.comentario,
            idTipoDano: this.estadoData.idTipoDano,
          });

          if (this.estadoData.dispositivo === 'Router') {
            this.isTablaRouter = true;
            this.isTablaONT = false;
            this.fetchRouter();
          } else {
            this.isTablaRouter = false;
            this.isTablaONT = true;
            this.fetchONT();
          }

          if (
            this.estadoData.direccionNueva === this.estadoData.direccionActual
          ) {
            this.estadoForm.get('direccionNuevo')?.setValue('');

            this.noti.mensaje(
              ' Asignar nuevo dispositivo',
              'Seleccione el dispositivo correspondiente para la activación del servicio.',
              TipoMessage.info
            );
          }
        }
      });
  }

  fetchRouter() {
    this.gService
      .list('rcasa/estado/1')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.router = response;
          this.dataRouter = new MatTableDataSource(this.router);
          this.dataRouter.sort = this.sort;
          this.dataRouter.paginator = this.paginator;
        },
        (error) => {
          console.error('Error Fetch ', error);
        }
      );
  }

  fetchONT() {
    this.gService
      .list('ont/estado/1')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.ont = response;
          this.dataONT = new MatTableDataSource(this.ont);
          this.dataONT.sort = this.sort;
          this.dataONT.paginator = this.paginator;
        },
        (error) => {
          console.error('Error Fetch ', error);
        }
      );
  }

  createEstado() {
    this.submitted = true;

    if (this.isCreate) {
      if (this.idEstado === 2) {
        const data = {
          idCliente: this.idCliente,
          fechaSuspencion: this.estadoForm.value.fechaSuspencion,
        };

        this.gService
          .create('ftth/suspencion/crear', data)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: any) => {
            this.respuesta = response;
            this.noti.mensajeRedirect(
              'Estado • Suspención',
              `La suspención ha sido registrada con éxito.`,
              TipoMessage.success,
              `/ftth`
            );
            this.ftthEstadoModal.emit();
          });
        this.closeModal();
      } else if (this.idEstado === 3) {
        const today = new Date();
        const todayDate = `${String(today.getDate()).padStart(2, '0')}/${String(
          today.getMonth() + 1
        ).padStart(2, '0')}/${today.getFullYear()}`;

        const data = {
          idRetiro: this.estadoForm.value.id,
          idCliente: this.idCliente,
          idEstadoR: this.estadoForm.value.idEstadoR,
          numOS: this.estadoForm.value.numOSRetiro || null,
          fechaDesinstalacion:
            this.estadoForm.value.fechaDesinstalacionRetiro || todayDate,
          comentario: this.estadoForm.value.comentarioRetiro || null,
          agente: this.estadoForm.value.agenteRetiro.toUpperCase() || null,
        };

        console.log(data);

        this.gService
          .create('ftth/retiro/crear', data)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: any) => {
            this.respuesta = response;
            this.noti.mensajeRedirect(
              'Estado • Retiro',
              `El retiro ha sido registrado con éxito.`,
              TipoMessage.success,
              `/ftth`
            );
            this.ftthEstadoModal.emit();
          });
        this.closeModal();
      } else if (this.idEstado === 4) {

        const today = new Date();
        const todayDate = `${String(today.getDate()).padStart(2, '0')}/${String(
          today.getMonth() + 1
        ).padStart(2, '0')}/${today.getFullYear()}`;

        const data = {
          idDanado: this.estadoForm.value.id,
          idCliente: this.idCliente,
          fechaInstalacion: this.estadoForm.value.fechaInstalacionDano || todayDate,
          dispositivo: this.estadoForm.value.dispositivo,
          direcActual: this.direccionActual,
          direcNueva:  this.direccionNuevo || this.direccionActual,
          comentario: this.estadoForm.value.comentarioDano || null,
          idTipoDano: this.estadoForm.value.idTipoDano,
        };

        this.gService
          .create('ftth/danado/crear', data)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: any) => {
            this.respuesta = response;
            this.noti.mensajeRedirect(
              'Estado • Dañado',
              `El daño ha sido registrado con éxito.`,
              TipoMessage.success,
              `/ftth`
            );
            this.ftthEstadoModal.emit();
          });
        this.closeModal();
      }
    } else {
      if (this.idEstado === 1) {
        const data = {
          idCliente: this.idCliente,
        };

        this.gService
          .create('ftth/activo/crear', data)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: any) => {
            this.respuesta = response;
            console.log(response);
            this.noti.mensajeRedirect(
              'Estado • Activo',
              `El servicio ha sido activado con éxito.`,
              TipoMessage.success,
              `/ftth`
            );
            this.ftthEstadoModal.emit();
          });
        this.closeModal();
      
      } else if (this.idEstado === 3) {
        const today = new Date();
        const todayDate = `${String(today.getDate()).padStart(2, '0')}/${String(
          today.getMonth() + 1
        ).padStart(2, '0')}/${today.getFullYear()}`;

        const data = {
          idRetiro: this.estadoForm.value.id,
          idCliente: this.idCliente,
          idEstadoR: this.estadoForm.value.idEstadoR,
          numOS: this.estadoForm.value.numOSRetiro || null,
          fechaDesinstalacion:
            this.estadoForm.value.fechaDesinstalacionRetiro || todayDate,
          comentario: this.estadoForm.value.comentarioRetiro || null,
          agente: this.estadoForm.value.agenteRetiro.toUpperCase() || null,
        };

        console.log(data);

        this.gService
          .create('ftth/retiro/crear', data)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: any) => {
            this.respuesta = response;
            this.noti.mensajeRedirect(
              'Estado • Retiro',
              `El retiro ha sido actualizado con éxito.`,
              TipoMessage.success,
              `/ftth`
            );
            this.ftthEstadoModal.emit();
          });
        this.closeModal();
      } else if (this.idEstado === 4) {

        const today = new Date();
        const todayDate = `${String(today.getDate()).padStart(2, '0')}/${String(
          today.getMonth() + 1
        ).padStart(2, '0')}/${today.getFullYear()}`;

        const data = {
          idDanado: this.estadoForm.value.id,
          idCliente: this.idCliente,
          fechaInstalacion: this.estadoForm.value.fechaInstalacionDano || todayDate,
          dispositivo: this.estadoForm.value.dispositivo,
          direcActual: this.direccionActual,
          direcNueva:  this.direccionNuevo || this.direccionActual,
          comentario: this.estadoForm.value.comentarioDano || null,
          idTipoDano: this.estadoForm.value.idTipoDano,
        };
        console.log(data); 

        // this.gService
        //   .create('ftth/danado/crear', data)
        //   .pipe(takeUntil(this.destroy$))
        //   .subscribe((response: any) => {
        //     this.respuesta = response;
        //     this.noti.mensajeRedirect(
        //       'Estado • Dañado',
        //       `El daño ha sido actualizado con éxito.`,
        //       TipoMessage.success,
        //       `/ftth`
        //     );
        //     this.ftthEstadoModal.emit();
        //   });
        // this.closeModal();
      }
    }
    // this.ftthEstadoModal.emit();
    // this.closeModal();
  }

  //Cambio de estado
  selectStatus(event: any) {
    const selectedId = parseInt(event.target.value, 10);

    this.idEstado = selectedId;

    this.estadoForm.patchValue({
      idEstado: selectedId,
    });
  }

  //Cambio de tipo de dispositivo
  danoStatus(event: any) {
    const selectedId = parseInt(event.target.value, 10);

    this.idTipoDano = selectedId;

    this.estadoForm.patchValue({
      idTipoDano: selectedId,
    });
  }

  //Desactivar tables cuando cambie de estado
  dispositivosStatus(event: any) {
    const selectedId = event.target.value;

    this.dispositivo = selectedId;

    this.estadoForm.patchValue({
      dispositivo: selectedId,
    });

    if (this.dispositivo === 'Router') {
      if (this.routerMACAdd) {
        this.estadoForm.patchValue({
          direccionActual: this.routerMACAdd,
        });
        this.direccionActual = this.routerMACAdd;
        this.cdRef.detectChanges();

      }
    }
    
    if (this.dispositivo === 'ONT') {
      if (this.ontMACAdd) {
        this.estadoForm.patchValue({
          direccionActual: this.ontMACAdd,
        });
        this.direccionActual = this.ontMACAdd;
        this.cdRef.detectChanges();

      }
    }
    
  }

  //Busqueda de ONT y Router por numActivo - Revisar
  activeNumChange(event: any) {
    const activo = event.target.value.trim();
    if (activo !== '') {
      this.filteredData = this.router.filter(
        (i: any) => i.activo && i.activo.toString().includes(activo)
      );
    } else {
      this.filteredData = this.router;
    }

    this.dataRouter.data = this.filteredData;
    this.paginator.firstPage();
  }

  activeNumONTChange(event: any) {
    const numero = event.target.value.trim().toUpperCase();

    if (numero !== '') {
      this.filteredDataONT = this.ont.filter(
        (i: any) =>
          i.numActivo && i.numActivo.toString().toUpperCase().includes(numero)
      );
    } else {
      this.filteredDataONT = this.ont;
    }
    this.dataONT.data = this.filteredDataONT;

    this.paginator.firstPage();
  }

  //Carga de los valores seleccionados de las tablas de  Router + ONT
  selectedButton: string | null = null;

  selectRouter(element: any) {
    if (this.direccionNuevo !== element.macAddress) {
      this.estadoForm.get('direccionNuevo')?.setValue('');

      this.direccionNuevo = element.macAddress;
      this.selectedButton = element.macAddress;

      this.estadoForm.patchValue({
        direccionNuevo: element.macAddress,
      });
    }
  }

  selectedButtonONT: string | null = null;

  selectONT(element: any) {
    //Falta que permita limpiar
    if (this.direccionNuevo !== element.macAdd) {
      console.log(element.macAdd);
      this.estadoForm.get('direccionNuevo')?.setValue('');

      this.direccionNuevo = element.macAdd;
      this.selectedButtonONT = element.macAdd;

      this.estadoForm.patchValue({
        direccionNuevo: element.macAdd,
      });
    }
  }

  //Limpiar direccion en caso de equivocación
  clearDireccionNueva() {
    this.estadoForm.get('direccionNuevo')?.setValue('');
    this.direccionNuevo = this.direccionActual;
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
      (this.estadoForm.controls[control].touched ||
        this.estadoForm.controls[control].untouched)
    );
  }
}
