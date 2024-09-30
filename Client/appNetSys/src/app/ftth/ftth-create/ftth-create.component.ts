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
import { NotificacionService } from '../../shared/notificacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { Datepicker } from 'flowbite';
import type { DatepickerOptions, DatepickerInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';

@Component({
  selector: 'app-ftth-create',
  templateUrl: './ftth-create.component.html',
  styleUrls: ['./ftth-create.component.css'],
})
export class FtthCreateComponent implements OnInit {
  isVisible = false;

  numero: any;
  nombre: any;
  zona: any;
  numCasa: any;
  potenciaRecepcion: any;
  numActivo: any;
  macAdress: any;
  numSN: any;
  idOLT: any;
  nombreZona: any;
  ip: any;
  idRouter: any;
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

  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  ftthForm!: FormGroup;
  ftthData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;
  infoCliente: any;
  displayedColumns: string[] = ['numero', 'accion'];
  filteredData: any;

  olts: any[] = [];
  router: any[] = [];
  bw: any[] = [];
  servicios: any[] = [];

  createVisible: boolean = true;
  tableVisiblie: boolean = false;
  btnVisible: boolean = true;

  dataSource = new MatTableDataSource<any>();
  dataRouter = new MatTableDataSource<any>();

  @Output() ftthCrearModal: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef;
  $datepickerEl: HTMLInputElement = document.getElementById(
    'datepicker-custom'
  ) as HTMLInputElement;

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  ngOnInit() {
    this.fetchOLTS();
    this.fetchCliente();
    this.fetchRouter();
    this.fetchBW();
    this.fetchServicios();
  }

  reactiveForm() {
    this.ftthForm = this.fb.group({
      id: [null, null],
      numero: [null, Validators.required],
      nombre: [null, Validators.required],
      zona: [null, Validators.required],
      numCasa: [null, Validators.required],
      potenciaRecepcion: [null, Validators.required],
      numActivo: [null, Validators.required],
      macAdress: [null, Validators.required],
      numSN: [null, Validators.required],
      idOLT: [null, Validators.required],
      nombreZona: [null, Validators.required],
      ip: [null, Validators.required],
      idRouter: [null, Validators.required],
      idTipo: [null, Validators.required],
      idEstado: [null, Validators.required],
      idBW: [null, Validators.required],
      kbps: [null, Validators.required],
      numOS: [null, Validators.required],
      cajaDerivada: [null, Validators.required],
      fechaInstalacion: [null, Validators.required],
      comentario: [null, Validators.required],
      agente: [null, Validators.required],
      cloudMonitoreo: [null, Validators.required],
      puertoNAT: [null, Validators.required],
    });
  }

  //   options: DatepickerOptions = {
  //     defaultDatepickerId: null,
  //     autohide: false,
  //     format: 'mm-dd-yyyy',
  //     maxDate: null,
  //     minDate: null,
  //     orientation: 'bottom',
  //     buttons: false,
  //     autoSelectToday: 0,
  //     title: null,
  //     rangePicker: false,
  //     onShow: () => {},
  //     onHide: () => {},
  // };

  // instanceOptions: InstanceOptions = {
  //   id: 'datepicker-custom-example',
  //   override: true
  // };

  // datepicker: DatepickerInterface = new Datepicker(
  //   // Datepicker,
  //   // options,
  //   // instanceOptions
  // );

  fetchServicios() {
    this.gService
      .list('service/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.servicios = response;
        console.log(this.servicios);
      });
  }

  fetchOLTS() {
    this.gService
      .list('olt/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.olts = response;
        console.log(this.olts);
      });
  }

  fetchCliente() {
    this.gService
      .list('ftth/info/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.infoCliente = response;
        console.log(this.infoCliente);
        this.dataSource = new MatTableDataSource(this.infoCliente);
        if (this.searchInput) {
          this.searchInput.nativeElement.value = '';
        }
      });
  }

  fetchRouter() {
    this.gService
      .list('router/estado/2')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.router = response;
        console.log(this.router);
        this.dataRouter = new MatTableDataSource(this.router);
      });
  }

  fetchBW() {
    this.gService
      .list('ftth/bw')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.bw = response;
        console.log(this.bw);
      });
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.submitted = false;
    this.ftthForm.reset();
    this.ftthCrearModal.emit();
    this.isVisible = false;
    this.createVisible = true;
    this.btnVisible = true;
    this.tableVisiblie = false;
  }

  //Crear
  crearFtth() {}

  //Buscar por cliente
  numberChange(event: any) {
    const numero = event.target.value.trim().toUpperCase();
    if (numero !== '') {
      this.filteredData = this.infoCliente.filter(
        (i: any) =>
          i.numero && i.numero.toString().toUpperCase().includes(numero)
      );
    } else {
      this.filteredData = this.infoCliente;
    }

    this.updateTable(this.filteredData);
  }

  onStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);

    this.ftthForm.patchValue({
      idOLT: selectedId,
    });
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

  //Busqueda de router por numActivo
  activeNumChange(event: any) {
    const numero = event.target.value.trim().toUpperCase();
    if (numero !== '') {
      this.filteredData = this.infoCliente.filter(
        (i: any) =>
          i.numActivo && i.numActivo.toString().toUpperCase().includes(numero)
      );
    } else {
      this.filteredData = this.infoCliente;
    }

    this.updateTable(this.filteredData);
  }

  updateTable(data: any) {
    this.dataSource.data = data;
  }

  searchCliente() {
    this.createVisible = false;
    this.btnVisible = false;
    this.tableVisiblie = true;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.ftthForm.reset();
  }
  
  // Control de Errores
  // public errorHandling = (control: string, error: string) => {
  //   return (
  //     this.ftthForm.controls[control].hasError(error) &&
  //     this.ftthForm.controls[control].invalid &&
  //     (this.makeSubmit || this.ftthForm.controls[control].touched)
  //   );
  // };
}
