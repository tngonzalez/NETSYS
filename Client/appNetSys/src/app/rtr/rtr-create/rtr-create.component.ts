import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
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

@Component({
  selector: 'app-rtr-create',
  templateUrl: './rtr-create.component.html',
  styleUrls: ['./rtr-create.component.css'],
})
export class RtrCreateComponent implements OnInit {
  isVisible = false;
  idEstado: any;
  activo: any;
  serie: any;
  macAddress: any;
  tipoDispositivo: any; 
  estado: any;

  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  routerForm!: FormGroup;
  routerData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  dataScanned: string = '';
  isScanningMac: boolean = true; 
  scanTimeOut: any = null; 

  @ViewChild('macInput') macInput!: ElementRef;
  @ViewChild('serieInput') serieInput!: ElementRef;
  @ViewChild('activoInput') activoInput!: ElementRef;
  @ViewChild('tipoInput') tipoInput!: ElementRef;


  router = {
    macAddress: '',
    serie: '',
  };

  tipos = [
    {value: 'Router', label: 'Router'},
    {value: 'ONU', label: 'ONU'},
  ];

  @Output() routerCrear: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  //Validaciones
  reactiveForm() {
    this.routerForm = this.fb.group({
      id: [null, null],
      idEstado: ['1'],
      activo: [null, Validators.required],
      serie: [null, Validators.required],
      macAddress: [null, Validators.required],
      tipoDispositivo: [null, Validators.required],
      estado: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.activoInput.nativeElement.focus();
    }, 0);
  }

  macChange(value: string) {
    if (value && value.length >= 12) {
      setTimeout(() => {
        this.serieInput.nativeElement.focus();
      }, 100);
    }
  }

  isValid(key: string): boolean {
    const validKeys = /^[a-zA-Z0-9-]+$/; // Solo letras, números y guiones
    return validKeys.test(key);
  }

  //Escucha los eventos del teclado
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if (key === 'Shift') {
      return;
    }

    if (key === 'Enter') {
      clearTimeout(this.scanTimeOut);

      this.scanTimeOut = setTimeout(() => {
        if (this.isScanningMac) {
          this.routerForm.controls['macAddress'].setValue(this.dataScanned);
          this.isScanningMac = false;
        } else {
          this.routerForm.controls['serie'].setValue(this.dataScanned);
          this.isScanningMac = true;
        }

        this.dataScanned = '';
      }, 200);
    }
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.submitted = false;
    this.routerForm.reset();
    this.routerCrear.emit(); 
    this.isVisible = false;
  }

  createRouter() {
    const data = {
      idEstado: parseInt(this.routerForm.value.idEstado,10),
      numActivo: this.routerForm.value.activo,
      serie: this.routerForm.value.serie,
      macAddress: this.routerForm.value.macAddress,
      tipoDispositivo: this.routerForm.value.tipoDispositivo,
    };

    console.log(data);
    this.gService
      .create('router/crear', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
        this.respuesta = response;
        this.noti.mensajeRedirect(
          'Router • Creación de router',
          `Router: ${data.numActivo} ha sido creado con exito.`,
          TipoMessage.success,
          `/rtr`
        );
        this.routerCrear.emit(); 
        this.closeModal(); 
      },
      (error: any) => {
        if(error.status  === 400) {
          this.noti.mensaje(
            'Error en la creación del router',
            error.error.mensaje,
            TipoMessage.error
          );
          this.routerForm.controls['macAddress'].reset();
          this.routerForm.controls['serie'].reset();
          this.routerForm.controls['activo'].reset();
          this.routerForm.controls['tipoDispositivo'].reset();

          setTimeout(() => {
            this.macInput.nativeElement.focus();
          }, 0); 
        } else {
          this.noti.mensaje(
            'Error en la creación de router',
            'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.',
            TipoMessage.error
          );
         }
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.routerForm.reset();
  }

  onChange(event: any): void {
    this.tipoDispositivo = event.target.value; 
  }
  
  // Control de Errores
  public errorHandling = (control: string, error: string) => {
    return (
      this.routerForm.controls[control].hasError(error) &&
      this.routerForm.controls[control].invalid &&
      (this.makeSubmit || this.routerForm.controls[control].touched)
    );
  };
}
