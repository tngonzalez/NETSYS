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

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.submitted = false;
    this.oltForm.reset();
    this.oltCrear.emit();
    this.isVisible = false;
  }

  createOLT() {
    const data = {
      nombreTipo: this.oltForm.value.nombreTipo,
      ODF: parseInt(this.oltForm.value.ODF),
      segmentoZona: this.oltForm.value.segmentoZona,
      ipGeneral: this.oltForm.value.ipGeneral,
      puertoNAT: this.oltForm.value.puertoNAT,
    };

    console.log(data);

    this.gService
      .create('olt/crear', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.respuesta = response;
          this.noti.mensajeRedirect(
            'OLT • Creación',
            `OLT: ${data.segmentoZona} ha sido creado con exito.`,
            TipoMessage.success,
            `/olt`
          );
          this.oltCrear.emit();
          this.closeModal();
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
          } else {
            this.noti.mensaje(
              'Error en la creación del OLT',
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
    this.oltForm.reset();
  }
  // Control de Errores
  public errorHandling = (control: string, error: string) => {
    return (
      this.oltForm.controls[control].hasError(error) &&
      this.oltForm.controls[control].invalid &&
      (this.makeSubmit || this.oltForm.controls[control].touched)
    );
  };
}
