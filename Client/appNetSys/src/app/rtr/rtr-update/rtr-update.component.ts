import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericService } from '../../shared/generic.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../shared/notificacion.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rtr-update',
  templateUrl: './rtr-update.component.html',
  styleUrls: ['./rtr-update.component.css'],
})
export class RtrUpdateComponent {
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

  statuses = [
    {
      id: 1,
      name: 'Disponible',
    },
    {
      id: 2,
      name: 'Asignado',
    },
  ];

  tipos = [
    {value: 'Router', label: 'Router'},
    {value: 'ONU', label: 'ONU'},
  ];

  @Output() routerActualizar: EventEmitter<void> = new EventEmitter<void>();

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
      idEstado: [null, Validators.required],
      activo: [null, Validators.required],
      serie: [null, Validators.required],
      macAddress: [null, Validators.required],
      tipoDispositivo: [null, Validators.required],
      estado: [null, Validators.required],
    });
  }

  openModal(id?: any) {
    this.isVisible = true;
    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
    }
  }

  closeModal() {
    this.submitted = false;
    this.routerForm.reset();
    this.routerActualizar.emit();
    this.isVisible = false;
  }

  loadData(id: any): void {
    this.gService
      .get('router/router', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.routerData = data;
        console.log(this.routerData); 
        const estadoId = this.statuses.find(
          (status) => status.name === this.routerData.estado
        )?.id;

        const tipo = this.tipos.find(
          (tipos) => tipos.value === this.routerData.tipoDispositivo	
        )?.label;

        this.routerForm.patchValue({
          id: this.routerData.id,
          idEstado: this.routerData.idEstado,
          activo: this.routerData.activo,
          serie: this.routerData.serie,
          macAddress: this.routerData.macAddress,
          tipoDispositivo: tipo,
          estado: estadoId,
        });
      });
  }

  onStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);

    this.routerForm.patchValue({
      idEstado: selectedId,
    });
  }

  onTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectValue = selectElement.value; 

    this.routerForm.patchValue({
      tipoDispositivo: selectValue,
    });
  }
  

  updateRouter() {

    this.gService
      .update('router/actualizar', this.routerForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.respuesta = data;
          this.noti.mensajeRedirect(
            'Router • Actualización',
            `Router: ${data.numActivo} ha sido actualizado con exito.`,
            TipoMessage.success,
            `/rtr`
          );
          this.routerActualizar.emit();
          this.closeModal();
        },
        (error: any) => {
          if (error.status === 400) {
            this.noti.mensaje(
              'Error en la actualización del router',
              error.error.mensaje,
              TipoMessage.error
            );
            this.routerActualizar.emit();
            this.closeModal();
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
  // Control de Errores
  public errorHandling = (control: string, error: string) => {
    return (
      this.routerForm.controls[control].hasError(error) &&
      this.routerForm.controls[control].invalid &&
      (this.makeSubmit || this.routerForm.controls[control].touched)
    );
  };
}
