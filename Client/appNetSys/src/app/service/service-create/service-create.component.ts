import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../shared/notificacion.service';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrl: './service-create.component.css',
})
export class ServiceCreateComponent {
  isVisible = false;
  nombre: any;
  idTipo: any;
  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  serviceForm!: FormGroup;
  serviceData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  @Output() serviceCrearModal: EventEmitter<void> = new EventEmitter<void>();

  //Creación/Actualización
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
    this.serviceForm = this.fb.group({
      id: [null, null],
      nombre: [null, Validators.required],
    });
  }

  openModal(id?: any) {
    this.isVisible = true;
    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
      this.idTipo = id;
    }
  }

  closeModal() {
    this.submitted = false;
    this.serviceForm.reset();
    this.serviceCrearModal.emit();
    this.isVisible = false;
  }

  loadData(id: any): void {
    this.isCreate = false;
    this.titleForm = 'Actualizar';
    this.idTipo = id;

    this.gService
      .get('service/detalle', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.serviceData = data;

        this.serviceForm.patchValue({
          id: this.serviceData.id,
          nombre: this.serviceData.service,
        });
      });
  }

  createService() {
    this.submitted = true;

    if (this.isCreate) {
      const data = {
        nombre: this.serviceForm.value.nombre,
      };

      this.gService
        .create('service/crear', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            this.respuesta = response;
            this.noti.mensaje(
              'Servicio • Creación de servicio',
              `${data.nombre} ha sido creado con exito.`,
              TipoMessage.success
            );
            this.serviceCrearModal.emit();
          },
          (error: any) => {
            this.noti.mensaje(
              'Error en la creación de servicio',
              'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.',
              TipoMessage.error
            );
          }
        );

      this.closeModal();
    } else {
      const data = {
        idTipo: this.idTipo,
        nombre: this.serviceForm.value.nombre,
      };

      this.gService
        .update('service/actualizar', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            this.respuesta = response;
            this.noti.mensaje(
              'Servicio • Actualización',
              `${data.nombre} ha sido actualizado con exito.`,
              TipoMessage.success
            );
            this.serviceCrearModal.emit();
          },
          (error: any) => {
            if (error.status === 400) {
              this.noti.mensaje(
                'Error en la actualización del OLT',
                error.error.mensaje,
                TipoMessage.error
              );
              this.serviceCrearModal.emit();
            }
          }
        );
      this.closeModal();
    }
    this.serviceCrearModal.emit();
    this.closeModal();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.serviceForm.reset();
  }
}
