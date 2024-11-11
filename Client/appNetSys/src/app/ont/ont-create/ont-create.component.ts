import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../shared/notificacion.service';

@Component({
  selector: 'app-ont-create',
  templateUrl: './ont-create.component.html',
  styleUrls: ['./ont-create.component.css'],
})
export class OntCreateComponent {
  isVisible = false;
  idONT: any;
  idEstado: any;
  nombreEstado: any; 
  numActivo: any;
  numSN: any;
  macAddress: any;

  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  ontForm!: FormGroup;
  ontData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  dataScanned: string = '';
  isScanningMac: boolean = true; 
  scanTimeOut: any = null; 

  @Output() ontCrear: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('macInput') macInput!: ElementRef;
  @ViewChild('serieInput') serieInput!: ElementRef;
  @ViewChild('activoInput') activoInput!: ElementRef;

  
  ont = {
    macAddress: '',
    serie: '',
  };
  
  //Creación / Actualización
  isCreate: boolean = true;
  titleForm: string = 'Crear';

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  //Validaciones
  reactiveForm() {
    this.ontForm = this.fb.group({
      id: [null, null],
      idEstado: [null,null],
      nombreEstado: [null,null],
      numActivo: [null, Validators.required],
      numSN: [null, Validators.required],
      macAddress: [null, Validators.required],
    });
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
          this.ontForm.controls['macAddress'].setValue(this.dataScanned);
          this.isScanningMac = false;
        } else {
          this.ontForm.controls['numSN'].setValue(this.dataScanned);
          this.isScanningMac = true;
        }

        this.dataScanned = '';
      }, 200);
    }
  }

  openModal(id?: any) {
    this.isVisible = true;

    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
      this.idONT = id;
      this.isCreate = false;
      this.ontForm.get('nombreEstado')?.disable();

    } else {
      this.isCreate = true;
      this.titleForm = 'Crear';
    }
  }

  closeModal() {
    this.submitted = false;
    this.ontForm.reset();
    this.ontCrear.emit();
    this.isVisible = false;
  }

  loadData(id: any): void {
    this.isCreate = false;
    this.titleForm = 'Actualizar';
    this.idONT = id;

    this.gService
      .get('ont/ont', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.ontData = data;
        console.log(this.ontData); 
        this.ontForm.patchValue({
          id: this.ontData.id,
          idEstado: this.ontData.idEstado,
          nombreEstado: this.ontData.estado,
          numActivo: this.ontData.numActivo,
          numSN: this.ontData.numSN,
          macAddress: this.ontData.macAddress,
        });

        this.idEstado = this.ontForm.value.idEstado;  

      });
  }

  createONT() {
    this.submitted = true;

    if (this.ontForm.invalid) {
      return;
    }

    if (this.isCreate) {
      
      const data = {
        numActivo: this.ontForm.value.numActivo,
        numSN: this.ontForm.value.numSN,
        macAddress: this.ontForm.value.macAddress,
      };

      this.gService
        .create('ont/crear', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            this.respuesta = response;
            this.noti.mensaje(
              'ONT • Creación',
              `${data.numActivo} ha sido creado con exito.`,
              TipoMessage.success
            );
            this.ontCrear.emit();
          },
          (error: any) => {
            if (error.status === 400) {
              this.noti.mensaje(
                'Error en la creación del ONT',
                error.error.mensaje,
                TipoMessage.error
              );
              this.ontForm.controls['macAddress'].reset();
              this.ontForm.controls['numSN'].reset();
              this.ontForm.controls['numActivo'].reset();
            }
          }
        );
      this.closeModal();
    } else {
      this.gService
        .update('ont/actualizar', this.ontForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respuesta = data;
          this.noti.mensaje(
            'ONT • Actualización',
            `${data.numActivo} ha sido actualizado con exito.`,
            TipoMessage.success
          );
          this.ontCrear.emit();
        });
      this.closeModal();
    }

    this.ontCrear.emit();
    this.closeModal(); 
  }

  //Permite restablecer el estado en caso de dañado
  changeStatus(){
    this.idEstado = 1; 
    this.ontForm.patchValue({
      idEstado: 1,
    }); 
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.ontForm.reset();
  }

  // Control de Errores
  errorHandling(control: string, error: string) {
    return this.ontForm.controls[control].hasError(error) && (this.submitted || this.ontForm.controls[control].touched);
  }
  
}
