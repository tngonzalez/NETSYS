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
  selector: 'app-ftth-create',
  templateUrl: './ftth-create.component.html',
  styleUrls: ['./ftth-create.component.css'],
})
export class FtthCreateComponent implements OnInit {
  isVisible = false;
  idCliente: any;

  numero: any;
  nombre: any;
  zona: any;
  numCasa: any;
  potenciaRecepcion: any;
  activo: any;
  macAdress: any;
  serie: any;

  numActivo: any;
  macAdd: any;
  numSN: any;

  idOLT: any;
  nombreZona: any;
  ip: any;
  idRouter_Casa: any;
  idONT: any;
  idTipo: any;
  idEstado: any;
  idBW: any;
  kbps: any;
  numOS: any;
  cajaDerivada: any;
  fechaInstalacion: any;
  comentario: any;
  agente: any;
  cloudMonitoreo: any;
  puertoNAT: any;

  //Retiro
  idRetiro: any;
  idEstadoR: any;
  numOSRetiro: any;
  fechaDesinstalacionRetiro: any;
  agenteRetiro: any;

  //Dañado
  idDanado: any;
  dispositivo1: any;
  fechaInstalacionDano: any;
  comentarioDano: any;
  direccionActual1: any;
  direccionNuevo1: any;
  idTipoDano1: any;

  dispositivo2: any;
  direccionActual2: any;
  direccionNuevo2: any;

  //Suspención
  idSuspencion: any;
  fechaSuspencion: any;

  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  ftthForm!: FormGroup;
  ftthData: any;

  danoForm!: FormGroup;
  danoData: any;

  retiroForm!: FormGroup; 
  retiroData: any; 

  suspencionForm!: FormGroup; 
  suspencionData: any; 


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

  olts: any[] = [];
  router: any[] = [];
  ont: any[] = [];
  bw: any[] = [];
  servicios: any[] = [];
  subredes: any[] = [];
  selectedOLT: number = 0;
  selectedServices: number = 0;
  selectedBW: number = 0;

  createVisible: boolean = true;
  tableVisiblie: boolean = false;
  btnVisible: boolean = true;

  dataRouter = new MatTableDataSource<any>();
  dataONT = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() ftthCrearModal: EventEmitter<void> = new EventEmitter<void>();

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

  //Creación / Actualización
  isCreate: boolean = true;
  titleForm: string = 'Crear';
  titleData: string = 'Nuevo';

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
    this.retiroReactiveForm();
    this.danoReactiveForm();
    this.suspencionReactiveForm();
  }

  ngOnInit() {
    this.fetchOLTS();
    this.fetchRouter();
    this.fetchBW();
    this.fetchServicios();
    this.fetchONT();
  }

  reactiveForm() {
    this.ftthForm = this.fb.group({

      //Cliente
      id: [null, null],
      numero: [null, Validators.required],
      nombre: [null, Validators.required],
      cloudMonitoreo: [null, null], //Actualizar

      //Condominio
      zona: [null, Validators.required],
      numCasa: [null, null],
      potenciaRecepcion: [null, Validators.required],

      //Router_Casa
      idRouter_Casa: [null, null],
      activo: [null, Validators.required],
      macAdress: [null, Validators.required],
      serie: [null, Validators.required],

      //ONT
      idONT: [null, null],
      numActivo: [null, Validators.required],
      macAdd: [null, Validators.required],
      numSN: [null, Validators.required],

      //OLT
      idOLT: [null, Validators.required],
      nombreZona: [null, Validators.required],
      ip: [null, Validators.required],

      //Servicio
      idTipo: [null, Validators.required],
      idEstado: [null, null],
      numOS: [null, Validators.required],
      cajaDerivada: [null, Validators.required],

      //BW
      idBW: [null, Validators.required],
      kbps: [null, Validators.required],

      //Adicional
      fechaInstalacion: [null, null],
      comentario: [null,null],
      agente: [null, Validators.required],
    });
  }

  retiroReactiveForm() {
    this.retiroForm = this.fb.group({
      id: [null, null], 
      //Retiro
      idCliente: [null, null],
      idRetiro: [null, null],
      idEstadoR: [null, Validators.required],
      numOSRetiro: [null, Validators.required],
      fechaDesinstalacionRetiro: [null, Validators.required],
      agenteRetiro: [null, Validators.required],
    });
  }

  danoReactiveForm() {
    this.danoForm = this.fb.group({
      id: [null, null], 

      //Dañado
      idDanado: [null, null],
      dispositivo1: [null, Validators.required],
      fechaInstalacionDano: [null, null],
      comentarioDano: [null, null],
      direccionActual1: [null, Validators.required],
      direccionNuevo1: [null, null],
      idTipoDano1: [null, Validators.required],

      //Dispositivo 2
      dispositivo2: [null, Validators.required],
      direccionActual2: [null, Validators.required],
      direccionNuevo2: [null, null],

      //Suspendición
      idSuspencion: [null, null],
      fechaSuspencion: [null, Validators.required],
    });
  }

  suspencionReactiveForm() {
    this.suspencionForm = this.fb.group({
      id: [null, null], 

      //Suspendición
      fechaSuspencion: [null, Validators.required],
    });
  }

  resetScroll() {
    const modalContent = document.querySelector('.modal-body');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
  }

  openModal(id?: any) {
    this.isVisible = true;
    this.resetScroll();

    this.fetchSubredes(this.selectedOLT);
    this.disabledBtn();

    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
      this.idCliente = id;
      this.isCreate = false;

      this.ftthForm.get('numero')?.disable();
      this.ftthForm.get('nombre')?.disable();
      this.ftthForm.get('cloudMonitoreo')?.disable(); 
    } else {
      this.isCreate = true;
      this.titleForm = 'Crear';
      this.titleData = 'Nuevo';

      this.ftthForm.get('numero')?.enable();
      this.ftthForm.get('nombre')?.enable();

      this.fetchOLTS();
      this.fetchRouter();
      this.fetchBW();
      this.fetchServicios();
      this.fetchONT();
    }
  }

  closeModal() {
    this.submitted = false;
    this.resetScroll();

    this.ftthForm.reset();
    this.retiroForm.reset();
    this.danoForm.reset();
    this.suspencionForm.reset();

    this.createVisible = true;

    this.ftthCrearModal.emit();
    this.isVisible = false;

    this.resetScroll(); 
  }

  //Cargar los datos en caso de actualizar
  loadData(id: any): void {
    this.isCreate = false;
    this.titleForm = 'Actualizar';
    this.titleData = 'Datos';
    this.idCliente = id;

    this.ftthForm.get('cloudMonitoreo')?.setValidators([Validators.required]);
    this.ftthForm.get('idEstado')?.setValidators([Validators.required]);
    this.ftthForm.get('id')?.setValidators([Validators.required]);

    this.gService
      .get('ftth/ftth', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.ftthData = data;
        this.ftthForm.patchValue({

        //Cliente 
        idCliente: this.ftthData.infoCliente.id,
        numero: this.ftthData.infoCliente.numero, 
        nombre: this.ftthData.infoCliente.nombre,  
        cloudMonitoreo: this.ftthData.cloudMonitoreo,

        //Condominio 
        zona: this.ftthData.infoCliente.Cliente_Condominio[0]?.condominio?.zona,
        numCasa: this.ftthData.infoCliente.Cliente_Condominio[0]?.condominio?.numCasa,

        //Servicio 
        idTipo: this.ftthData.tipoCliente.idTipo,
        numOS: this.ftthData.numOS, 
        cajaDerivada: this.ftthData.cajaDerivada, 

        //BW
        idBW: this.ftthData.bw.idBW,
        kbps: this.ftthData.BW_KBPS, 

        //Router_Casa
        idRouter_Casa: this.ftthData.rcasa.idRouter_Casa, 
        activo: this.ftthData.rcasa.numActivo,  
        serie: this.ftthData.rcasa.serie, 
        macAdress: this.ftthData.rcasa.macAddress, 

        //ONT
        idONT: this.ftthData.ont.idONT, 
        numActivo: this.ftthData.ont.numActivo,  
        macAdd: this.ftthData.ont.macAddress, 
        numSN: this.ftthData.ont.numSN, 
        potenciaRecepcion: this.ftthData.potenciaRecepcion,

        //OLT 
        idOLT: this.ftthData.rgestor.idOLT, 
        ip: this.ftthData.rgestor.subred.ip,
        nombreZona: this.ftthData.rgestor.zona.nombreZona,

        //Adicional
        fechaInstalacion: this.ftthData.fechaInstalacion,
        comentario: this.ftthData.comentario, 
        agente: this.ftthData.agente, 
        
        idEstado: this.ftthData.estado.idEstado,

        });

        //Añade la IP asignada al listado de IP`s
        if (this.subredes.indexOf(this.ftthData.rgestor.ip) === -1) {
          this.subredes.push(this.ftthData.rgestor.subred.ip);
        }

      });

      setTimeout(() => {
        const data = {
          idCliente: this.idCliente,
          idEstado: this.ftthForm.value.idEstado,
        };

        this.idEstado = this.ftthForm.value.idEstado;

        if(this.idEstado !== 1) {
          this.gService
          .create('ftth/estado', data)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
    
            if(this.ftthForm.value.idEstado == 2) {
              this.suspencionData = data;
              this.suspencionForm.patchValue({
                idSuspencion: this.suspencionData.idSuspencion,
               fechaSuspencion: this.suspencionData.fechaSuspencion,
              });
           }
           else if(this.ftthForm.value.idEstado == 3) {
             this.retiroData = data;
             this.retiroForm.patchValue({
               idRetiro: this.retiroData.idRetiro,
               fechaDesinstalacionRetiro: this.retiroData.fechaDesinstalacion,
               numOSRetiro: this.retiroData.numOS,
               comentario: this.retiroData.comentario,
               agenteRetiro: this.retiroData.agente,
               idEstadoR: this.retiroData.idEstadoR,
             });
           }
           else if(this.ftthForm.value.idEstado == 4) {
            this.danoData = data;
            this.danoForm.patchValue({
              idDanado: this.danoData.idDanado,
              fechaInstalacionDano: this.danoData.fechaInstalacion,
              dispositivo1: this.danoData.dispositivo1,
              direccionActual1: this.danoData.direccionActual1,
              direccionNuevo1: this.danoData.direccionNuevo1,
              comentarioDano: this.danoData.comentario,
              idTipoDano1: this.danoData.idTipoDano1,

              dispositivo2: this.danoData.dispositivo2,
              direccionActual2: this.danoData.direccionActual2,
              direccionNuevo2: this.danoData.direccionNuevo2,
            });
          }
          
          }); 
        }

      }, 100);
 
  }

  fetchServicios() {
    this.gService
      .list('service/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.servicios = response;

        if (this.servicios && this.servicios.length > 0) {
          this.ftthForm.patchValue({ idTipo: this.servicios[0].id });
          this.selectedServices = this.servicios[0].id;
        }
      });
  }

  fetchOLTS() {
    this.gService
      .list('olt/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.olts = response;

        if (this.olts && this.olts.length > 0) {
          this.ftthForm.patchValue({ idOLT: this.olts[0].idOLT });
          this.selectedOLT = this.olts[0].idOLT;
          this.fetchSubredes(this.selectedOLT);
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

  fetchBW() {
    this.gService
      .list('ftth/bw')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.bw = response;

        if (this.bw && this.bw.length > 0) {
          this.ftthForm.patchValue({ idBW: this.bw[0].id });
          this.selectedBW = this.bw[0].id;
        }
      });
  }

  //Renderizar las subredes
  fetchSubredes(idOLT: number): void {
    this.gService
      .get('olt/red', idOLT)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.subredesDisponibles) {
          this.subredes = response.subredesDisponibles;

          if (this.subredes && this.subredes.length > 0) {
            this.ftthForm.patchValue({ ip: this.subredes[0] });
          }
        } else {
          this.subredes = [];
        }
      });
  }

  //Dropdown
  onOLTChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);

    this.fetchSubredes(selectedId);
  }

  onBWChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);

    this.ftthForm.patchValue({
      idBW: selectedId,
    });
  }

  onServiceChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);

    this.ftthForm.patchValue({
      idTipo: selectedId,
    });
  }

  //Busqueda de ONT y Router por numActivo
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
    if (this.idRouter_Casa !== element.id) {
      this.idRouter_Casa = element.id;

      element.desactivado = true;

      this.selectedButton = element.id;

      this.ftthForm.patchValue({
        idRouter_Casa: element.id,
        activo: element.activo,
        serie: element.serie,
        macAdress: element.macAddress,
      });
    }
    if (this.idRouter_Casa === element.id) {
      element.desactivado = false;
    }
  }

  selectedButtonONT: string | null = null;

  selectONT(element: any) {
    if (this.idONT !== element.id) {
      this.idONT = element.id;

      element.desactivado = true;

      this.selectedButtonONT = element.id;

      this.ftthForm.patchValue({
        idONT: element.id,
        numActivo: element.numActivo,
        numSN: element.numSN,
        macAdd: element.macAdd,
      });
    }
    if (this.idONT === element.id) {
      element.desactivado = false;
    }
  }

  disabledBtn() {
    this.ftthForm.get('activo')?.disable();
    this.ftthForm.get('serie')?.disable();
    this.ftthForm.get('macAdress')?.disable();

    this.ftthForm.get('numActivo')?.disable();
    this.ftthForm.get('numSN')?.disable();
    this.ftthForm.get('macAdd')?.disable();
  }

  //Cambio de estado - Actualizar
  selectStatus(event: any) {
    const selectedId = parseInt(event.target.value, 10);

    this.idEstado = selectedId;

    this.ftthForm.patchValue({
      idEstado: selectedId,
    });

    //Si el estado cambia desactiva el formulario
    if (this.idEstado !== 1) {
      [
        'zona',
        'numCasa',
        'potenciaRecepcion',
        'kbps',
        'numOS',
        'cajaDerivada',
        'fechaInstalacion',
        'comentario',
        'agente',
        'nombreZona',
      ].forEach((campo) => {
        this.ftthForm.get(campo)?.disable();
      });

      // Desactivar Dropdowns
      this.ftthForm.get('idOLT')?.disable();
      this.ftthForm.get('idBW')?.disable();
      this.ftthForm.get('idTipo')?.disable();

      // Desactivar Tablas
      this.isTablaRouter = true;
      this.isTablaONT = true;
      this.isRouterS = true;
      this.isONTS = true;
    } else {
      // Si el estado es 1, habilitar nuevamente los campos y dropdowns
      [
        'zona',
        'numCasa',
        'potenciaRecepcion',
        'kbps',
        'numOS',
        'cajaDerivada',
        'fechaInstalacion',
        'comentario',
        'agente',
        'nombreZona',
        '',
      ].forEach((campo) => {
        this.ftthForm.get(campo)?.enable();
      });

      // Habilitar Dropdowns
      this.ftthForm.get('idOLT')?.enable();
      this.ftthForm.get('idBW')?.enable();
      this.ftthForm.get('idTipo')?.enable();

      // Habilitar Tablas
      this.isTablaRouter = false;
      this.isTablaONT = false;
      this.isRouterS = false;
      this.isONTS = false;
    }
  }

  danoStatus(event: any) {
    const selectedId = parseInt(event.target.value, 10);

    this.idTipoDano1 = selectedId;

    this.danoForm.patchValue({
      idTipoDano: selectedId,
    });
  }

  //Desactivar tables cuando cambie de estado
  dispositivosStatus(event: any) {
    const selectedId = event.target.value;

    this.dispositivo1 = selectedId;

    this.danoForm.patchValue({
      dispositivo1: selectedId,
    });

    if (this.dispositivo1 === 'Router') {
      this.isTablaRouter = false;
      this.isTablaONT = true;
    }
    if (this.dispositivo2 === 'ONT') {
      this.isTablaONT = false;
      this.isTablaRouter = true;
    }
  }

  //Crear
  createFTTH() {
    this.submitted = true;

    if (this.ftthForm.invalid) {
      console.log("invalido")
      return;
    }

    const data = {
      numero: this.ftthForm.value.numero.toUpperCase(),
      nombre: this.ftthForm.value.nombre.toUpperCase(),
      zona: this.ftthForm.value.zona.toUpperCase(),
      numCasa: (this.ftthForm.value.numCasa && isNaN(this.ftthForm.value.numCasa)) ? this.ftthForm.value.numCasa.toUpperCase() : this.ftthForm.value.numCasa,
      potenciaRecepcion: this.ftthForm.value.potenciaRecepcion,
      idONT: parseInt(this.ftthForm.value.idONT),
      idOLT: parseInt(this.ftthForm.value.idOLT),
      nombreZona: this.ftthForm.value.nombreZona.toUpperCase(),
      ip: this.ftthForm.value.ip,
      idRouter_Casa: parseInt(this.ftthForm.value.idRouter_Casa),
      idTipo: parseInt(this.ftthForm.value.idTipo),
      idBW: parseInt(this.ftthForm.value.idBW),
      kbps: this.ftthForm.value.kbps,
      numOS: this.ftthForm.value.numOS,
      cajaDerivada: this.ftthForm.value.cajaDerivada,
      fechaInstalacion: this.ftthForm.value.fechaInstalacion,
      comentario: this.ftthForm.value.comentario,
      agente: this.ftthForm.value.agente.toUpperCase(),
    };

    this.gService
      .create('ftth/crear', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.respuesta = response;
          this.noti.mensajeRedirect(
            'FTTH • Creación',
            `${data.numero} ha sido creado con exito.`,
            TipoMessage.success,
            `/ftth`
          );
          this.ftthCrearModal.emit();
        },
        (error: any) => {
          if (error.status === 400) {
            this.noti.mensaje(
              'Error en la creación del FTTH',
              error.error.mensaje,
              TipoMessage.error
            );
          }
        }
      );

    
    this.closeModal();

    // else {

    // }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.ftthForm.reset();
    this.ftthForm.enable();
  }

  // Control de Errores
  errorHandling(control: string, error: string) {
    return this.ftthForm.controls[control].hasError(error) && (this.submitted || this.ftthForm.controls[control].touched);
  }
}
