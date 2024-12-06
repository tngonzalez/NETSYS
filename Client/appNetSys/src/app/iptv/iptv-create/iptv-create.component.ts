import {
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
import {
  NotificacionService,
  TipoMessage,
} from '../../shared/notificacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-iptv-create',
  templateUrl: './iptv-create.component.html',
  styleUrls: ['./iptv-create.component.css'],
})
export class IptvCreateComponent implements OnInit {
  isVisible = false;
  selectedStatus: any;

  //Form Data
  idIPTV: any;

  idDNS: any;
  email: any;
  mac: any;
  dns: any;

  idDNSAnterior = 0;
  danado: boolean = false;

  idCliente: any;
  nombre: any;
  numero: any;
  cloud: any;

  idEstadoInstalacion: any;
  fechaInstalacion: any;
  comentario: any;
  agente: any;


  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  iptvForm!: FormGroup;
  iptvData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  displayedClientes: string[] = ['numero', 'nombre', 'accion'];
  displayedDNS: string[] = ['mac', 'dsn', 'accion'];

  filteredDataCl: any;
  filteredDataDNS: any;

  clientes: any[] = [];
  infoDNS: any[] = [];

  dataClientes = new MatTableDataSource<any>();
  dataDNS = new MatTableDataSource<any>();

  @Output() iptvCrear: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('searchClienteInput') searchClienteInput!: ElementRef;
  @ViewChild('searchDNSInput') searchDNSInput!: ElementRef;

  //Creación / Actualización
  isCreate: boolean = true;
  titleStatus: string = 'Crear';
  titleForm: string = 'Propietario';

  createVisible: boolean = true;
  tableVisiblie: boolean = false;

  statuses = [
    {
      id: 0,
      name: 'Estado',
    },
    {
      id: 1,
      name: 'Instalado',
    },
    {
      id: 2,
      name: 'Instalación Pendiente',
    },
  ];

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  ngOnInit() {
    this.fetchDNS();
    this.fetchClientes();
  }

  reactiveForm() {
    this.iptvForm = this.fb.group({
      id: [null, null],

      //Info Cliente
      idCliente: [null, Validators.required],
      nombre: [null, null],
      numero: [null, null],
      cloud: [null, null], //Actualizar

      //Info. DNS
      idDNS: [null, null],
      usuario: [null, null],
      dsn: [null, null],
      mac: [null, null],

      idDNSAnterior: [null, null],
      numOS: [null, Validators.required],


      idEstadoInstalacion: [null, Validators.required],

      fechaInstalacion: [null, null],
      comentario: [null, null],
      agente: [null, null]
    });
  }

  openModal(id?: any) {
    this.isVisible = true;
    this.disabledBtn();
    this.idDNSAnterior = 0;

    this.fetchDNS();
    this.fetchClientes();

    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
      this.idIPTV = id;
      this.isCreate = false;
      this.createVisible = false;
      this.titleForm = 'Cliente Propietario';
      this.titleStatus = 'Actualizar';

      this.iptvForm.get('numOS')?.disable();


    } else {
      this.isCreate = true;
      this.titleStatus = 'Crear';
      this.createVisible = true;
      this.titleForm = 'Datos: Cliente Seleccionado';

      this.iptvForm.patchValue({ idEstadoInstalacion: 1 });
      this.iptvForm.get('numOS')?.enable();

    }
  }

  closeModal() {
    this.submitted = false;

    this.searchClienteInput.nativeElement.value = '';
    this.searchDNSInput.nativeElement.value = '';

    this.iptvForm.reset();
    this.iptvCrear.emit();
    this.isVisible = false;

    this.resetScroll();
  }

  loadData(id: any): void {
    this.isCreate = false;
    this.titleForm = 'Actualizar';
    this.idIPTV = id;

    this.gService
      .get('iptv/iptv', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.iptvData = data;

        this.iptvForm.patchValue({
          id: this.iptvData.id,

          idDNS: this.iptvData.idDSN,
          mac: this.iptvData.mac,
          usuario: this.iptvData.usuario,
          dsn: this.iptvData.dsn,

          idCliente: this.iptvData.idCliente,
          nombre: this.iptvData.clienteNum,
          numero: this.iptvData.clienteNombre,
          cloud: this.iptvData.clienteCloud,
          numOS: this.iptvData.numOS,

          idEstadoInstalacion: this.iptvData.idEstadoInstalacion,
          fechaInstalacion: this.iptvData.fechaInstalacion,
          comentario: this.iptvData.comentario,
          agente: this.iptvData.agente
        });
      });
  }

  fetchClientes() {
    this.gService
      .list('iptv/cliente')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.clientes = response;
          this.dataClientes = new MatTableDataSource(this.clientes);
          this.dataClientes.sort = this.sort;
          this.dataClientes.paginator = this.paginator;
        },
        (error) => {
          console.error('Error Fetch ', error);
        }
      );
  }

  fetchDNS() {
    this.gService
      .list('dns/estado/1')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.infoDNS = response;
          this.dataDNS = new MatTableDataSource(this.infoDNS);
          this.dataDNS.sort = this.sort;
          this.dataDNS.paginator = this.paginator;
        },
        (error) => {
          console.error('Error Fetch ', error);
        }
      );
  }

  activeNumDNSChange(event: any) {
    const numero = event.target.value.trim().toUpperCase();

    if (numero !== '') {
      this.filteredDataDNS = this.infoDNS.filter(
        (i: any) => i.dns && i.dns.toString().toUpperCase().includes(numero)
      );
    } else {
      this.filteredDataDNS = this.infoDNS;
    }
    this.dataDNS.data = this.filteredDataDNS;

    this.paginator.firstPage();
  }

  clienteChange(event: any) {
    const cliente = event.target.value.trim().toLowerCase();
    if (cliente !== '') {
      this.filteredDataCl = this.clientes.filter(
        (i: any) =>
          i.nombre && i.nombre.toString().toLowerCase().includes(cliente)
      );
    } else {
      this.filteredDataCl = this.clientes;
    }

    this.dataClientes.data = this.filteredDataCl;

    this.paginator.firstPage();
  }

  selectStatus(event: any) {
    const selectId = parseInt(event.target.value, 10);

    this.idEstadoInstalacion = selectId;

    this.iptvForm.patchValue({
      idEstadoInstalacion: selectId,
    });
  }

  selectedButton: string | null = null;

  selectDNS(event: any) {
    const idDNSValue = this.iptvForm.get('idDNS');

    if (idDNSValue?.value !== event.id) {
      this.idDNSAnterior = idDNSValue?.value;

      this.idDNS = event.id;
      event.desactivado = true;
      this.selectedButton = event.id;

      this.iptvForm.patchValue({
        idDNS: event.id,
        mac: event.mac,
        dsn: event.dsn,
        usuario: event.usuario,
      });
    }

    if (this.idDNS === event.id) {
      event.desactivado = false;
    }
  }

  onStatusDNSChange(event: any) {
    if (event.target.value === 'si') {
      this.danado = true;
    } else {
      this.danado = false;
    }
  }

  selectedButtonCl: string | null = null;

  selectCliente(event: any) {
    if (this.idCliente !== event.idCliente) {
      this.idCliente = event.idCliente;
      event.desactivado = true;
      this.selectedButtonCl = event.idCliente;

      this.iptvForm.patchValue({
        idCliente: event.idCliente,
        nombre: event.nombre,
        numero: event.numero,
        cloud: event.cloud,
      });
    }

    if (this.idCliente === event.idCliente) {
      event.desactivado = false;
    }
  }

  disabledBtn() {
    this.iptvForm.get('nombre')?.disable();
    this.iptvForm.get('numero')?.disable();
    this.iptvForm.get('cloud')?.disable();

    this.iptvForm.get('mac')?.disable();
    this.iptvForm.get('dsn')?.disable();
    this.iptvForm.get('usuario')?.disable();
  }

  crearIPTV() {
    this.submitted = true;

    if (this.isCreate) {
      const data = {
        idDSN: this.iptvForm.value.idDNS
          ? parseInt(this.iptvForm.value.idDNS)
          : null,
        idCliente: parseInt(this.iptvForm.value.idCliente),
        idEstadoInstalacion: parseInt(this.iptvForm.value.idEstadoInstalacion),
        fechaInstalacion: this.iptvForm.value.fechaInstalacion || null,
        comentario: this.iptvForm.value.comentario || null,
        agente: this.iptvForm.value.agente || null,
        numOS: parseInt(this.iptvForm.value.numOS),
      };

      console.log(data); 

      this.gService
        .create('iptv/crear', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            this.respuesta = response;
            this.noti.mensajeRedirect(
              'IPTV • Creación',
              `Servicio creado con exito.`,
              TipoMessage.success,
              `/iptv`
            );
            this.closeModal();
            this.iptvCrear.emit();
          },
          (error: any) => {
            if (error.status === 400) {
              this.noti.mensaje(
                'Error en la creación del IPTV',
                error.error.mensaje,
                TipoMessage.error
              );
            }
          }
        );
      this.closeModal();
    } else {
      const data = {
        idIPTV: this.idIPTV,
        idDSN: this.iptvForm.value.idDNS
          ? parseInt(this.iptvForm.value.idDNS)
          : null,
        danado: this.danado,
        numOS: parseInt(this.iptvForm.value.numOS),
        idCliente: parseInt(this.iptvForm.value.idCliente),
        idEstadoInstalacion: parseInt(this.iptvForm.value.idEstadoInstalacion),
        fechaInstalacion: this.iptvForm.value.fechaInstalacion || null,
        comentario: this.iptvForm.value.comentario || null,
        agente: this.iptvForm.value.agente || null,

      };

      this.gService
        .update('iptv/actualizar', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respuesta = data;
          this.noti.mensajeRedirect(
            'IPTV • Actualización',
            `Servicio actualizado con exito.`,
            TipoMessage.success,
            `/iptv`
          );
        });
      this.closeModal();
      this.iptvCrear.emit();
    }

    this.iptvCrear.emit();
    this.closeModal();
  }

  resetScroll() {
    const modalContent = document.querySelector('.modal-body');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.iptvForm.reset();
  }

  // Control de Errores
  errorHandling(control: string, error: string) {
    return (
      this.iptvForm.controls[control].hasError(error) &&
      (this.iptvForm.controls[control].touched || this.submitted)
    );
  }
}
