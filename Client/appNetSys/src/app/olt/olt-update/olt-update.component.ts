import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService } from '../../shared/notificacion.service';

@Component({
  selector: 'app-olt-update',
  templateUrl: './olt-update.component.html',
  styleUrls: ['./olt-update.component.css'],
})
export class OltUpdateComponent {
  isVisible = false;
  ODF: any;
  idOLT: any;
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

  @Output() oltActualizar: EventEmitter<void> = new EventEmitter<void>();

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
      ipGeneral: [{ value: '', disabled: true }],
      puertoNAT: [null, Validators.required],
    });
  }

  openModal(id?: any) {
    this.isVisible = true;
    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
      console.log(id); 
    }
  }

  closeModal() {
    this.submitted = false;
    this.oltForm.reset();
    this.oltActualizar.emit();
    this.isVisible = false;
  }

  loadData(id: any): void {
    console.log(id); 
    this.gService
      .get('olt/olt', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.oltData = data;
        console.log(this.oltData);

        this.oltForm.patchValue({
          id: this.oltData.id,
          nombreTipo: this.oltData.nombreTipoOLT,
          ODF: this.oltData.ODF,
          segmentoZona: this.oltData.segmentoZona,
          ipGeneral: this.oltData.ipGeneral,
          puertoNAT: this.oltData.puertoNAT,
        });
      });
  }

  updateOLT() {}

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
