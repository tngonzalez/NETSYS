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
  idRouter: any; 
  idEstado: any;
  activo: any;
  serie: any;
  macAddress: any;

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

  //Creación / Actualización 
  isCreate: boolean = true; 
  titleForm: string = 'Crear'; 

  @Output() routerCrear: EventEmitter<void> = new EventEmitter<void>();


  @ViewChild('macInput') macInput!: ElementRef;
  @ViewChild('serieInput') serieInput!: ElementRef;
  @ViewChild('activoInput') activoInput!: ElementRef;


  router = {
    macAddress: '',
    serie: '',
  };

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
      idEstado: [null],
      activo: [null, Validators.required],
      serie: [null, Validators.required],
      macAddress: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.activoInput.nativeElement.focus();
    }, 0);
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

  openModal(id?:any) {
    this.isVisible = true;

    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
      this.idRouter = id;
      this.isCreate = false; 
    } else {
      this.isCreate = true; 
      this.titleForm = "Crear"; 
    }
  }

  closeModal() {
    this.submitted = false;
    this.routerForm.reset();
    this.routerCrear.emit(); 
    this.isVisible = false;
  }

  loadData(id: any): void {
    this.isCreate = false;
    this.titleForm = 'Actualizar';
    this.idRouter = id;

    this.gService
      .get('rcasa/router', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.routerData = data;
    

        this.routerForm.patchValue({
          id: this.routerData.id,
          idEstado: this.routerData.idEstado,
          activo: this.routerData.activo,
          serie: this.routerData.serie,
          macAddress: this.routerData.macAddress,
        });
      });
  }

  createRouter() {

    this.submitted = true; 

    if(this.routerForm.invalid) {
      return;
    }

    if(this.isCreate) {

      const data = {
        numActivo: this.routerForm.value.activo,
        serie: this.routerForm.value.serie,
        macAddress: this.routerForm.value.macAddress,
      };

      this.gService
      .create('rcasa/crear', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
        this.respuesta = response;
        this.noti.mensaje(
          'Router • Creación',
          `${data.numActivo} ha sido creado con exito.`,
          TipoMessage.success
        );
        this.routerCrear.emit(); 
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

          setTimeout(() => {
            this.macInput.nativeElement.focus();
          }, 0); 
        }
      }
    );
    this.closeModal(); 
    
    } 
    else {
      
      this.gService
      .update('rcasa/actualizar', this.routerForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.respuesta = data;
          this.noti.mensaje(
            'Router • Actualización',
            `${data.numActivo} ha sido actualizado con exito.`,
            TipoMessage.success
          );
          this.routerCrear.emit();
        });
    this.closeModal(); 
    }

    this.routerCrear.emit();
    this.closeModal(); 
  }

  onStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);

    this.routerForm.patchValue({
      idEstado: selectedId,
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.routerForm.reset();
  }

 
  // Control de Errores
  errorHandling = (control: string, error: string) => {
    return
      this.routerForm.controls[control].hasError(error);
  };
}
