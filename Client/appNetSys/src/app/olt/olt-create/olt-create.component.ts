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

@Component({
  selector: 'app-olt-create',
  templateUrl: './olt-create.component.html',
  styleUrls: ['./olt-create.component.css'],
})
export class OltCreateComponent {
  isVisible = false;
  idOLT: any;
  ODF: any;
  nombreTipo: any;
  segmentoZona: any;
  ipGeneral: any;
  puertoNAT: any;

  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  oltForm!: FormGroup;
  oltData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  //Creación/Actualización
  isCreate: boolean = true;
  titleForm: string = 'Crear';

  @Output() oltCrear: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('odfInput') odfInput!: ElementRef;
  @ViewChild('tipoInput') tipoInput!: ElementRef;
  @ViewChild('segmentoInput') segmentoInput!: ElementRef;
  @ViewChild('ipInput') ipInput!: ElementRef;
  @ViewChild('puertoInput') puertoInput!: ElementRef;

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  //Validaciones
  reactiveForm() {
    this.oltForm = this.fb.group({
      id: [null, null],
      ODF: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      nombreTipo: [null, Validators.required],
      segmentoZona: [null, Validators.required],
      ipGeneral: [null, Validators.required],
      puertoNAT: [null, Validators.required],
    });
  }

  openModal(id?: any) {
    this.isVisible = true;

    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
      this.idOLT = id;
      this.isCreate = false; 
    } else{
      this.isCreate = true; 
      this.titleForm = "Crear"
      this.oltForm.get('ipGeneral')?.enable(); 

    }

  }

  closeModal() {
    this.submitted = false;
    this.oltForm.reset();
    this.oltCrear.emit();
    this.isVisible = false;
  }

  loadData(id: any): void {
    this.isCreate = false;
    this.titleForm = 'Actualizar';
    this.idOLT = id;

    this.gService
      .get('olt/olt', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.oltData = data;

        this.oltForm.patchValue({
          idOLT: this.oltData.id,
          nombreTipo: this.oltData.nombreTipoOLT,
          ODF: this.oltData.ODF,
          segmentoZona: this.oltData.segmentoZona,
          ipGeneral: this.oltData.ipGeneral,
          puertoNAT: this.oltData.puertoNAT,
        });
        
        //Desactiva el input de ipGeneral
        this.oltForm.get('ipGeneral')?.disable(); 
      });
  }

  createOLT() {
    this.submitted = true;

    if(this.oltForm.invalid) {
       return;
    }
    
    if(this.isCreate){
      
      const data = {
        nombreTipo: this.oltForm.value.nombreTipo,
        ODF: parseInt(this.oltForm.value.ODF),
        segmentoZona: this.oltForm.value.segmentoZona,
        ipGeneral: this.oltForm.value.ipGeneral,
        puertoNAT: this.oltForm.value.puertoNAT,
      };

      this.gService
      .create('olt/crear', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.respuesta = response;
          this.noti.mensaje(
            'OLT • Creación',
            `${data.segmentoZona} ha sido creado con exito.`,
            TipoMessage.success
          );
          this.oltCrear.emit();
        },
        (error: any) => {
          if (error.status === 400) {
            this.noti.mensaje(
              'Error en la creación del OLT',
              `La información ingresada ya existe. Por favor, intente con otro OLT`,
              TipoMessage.error
            );

            this.oltForm.controls['nombreTipo'].reset();
            this.oltForm.controls['ODF'].reset();
            this.oltForm.controls['segmentoZona'].reset();
            this.oltForm.controls['ipGeneral'].reset();
            this.oltForm.controls['puertoNAT'].reset();

            setTimeout(() => {
              this.tipoInput.nativeElement.focus();
            }, 0);
          }
        }
      );
      this.closeModal(); 
    }

     else{  
      const data = {
        idOLT: this.idOLT,
        nombreTipo: this.oltForm.value.nombreTipo,
        ODF: parseInt(this.oltForm.value.ODF),
        segmentoZona: this.oltForm.value.segmentoZona,
        puertoNAT: this.oltForm.value.puertoNAT,
      };

      this.gService
        .update('olt/actualizar', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            this.respuesta = response;
            this.noti.mensaje(
              'OLT • Actualización',
              `${data.segmentoZona} ha sido actualizada con exito.`,
              TipoMessage.success
            );
            this.oltCrear.emit();
          });
      this.closeModal();     
    }

    this.oltCrear.emit();
    this.closeModal();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.oltForm.reset();
  }
  // Control de Errores
  errorHandling(control: string, error: string) {
    return this.oltForm.controls[control].hasError(error) && (this.submitted || this.oltForm.controls[control].touched);
  }
}
