import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notificacion.service';

@Component({
  selector: 'app-service-delete',
  templateUrl: './service-delete.component.html',
  styleUrl: './service-delete.component.css'
})
export class ServiceDeleteComponent {
  isVisible = false;
  idS: number = 0;

  respuesta: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() idService: number | null = null;
  @Output() serviceDeleteModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {}

  openModal(id: any) {
    this.idS = id;
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  deleteService() {
    this.gService
      .delete('service/eliminar', this.idS)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respuesta = data;

        this.noti.mensajeRedirect(
          'Servicio • Eliminado',
          `El servicio seleccionado fue eliminado exitosamente. `,
          TipoMessage.success,
          `/service`
        );
        this.serviceDeleteModal.emit();
      });
    this.closeModal();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }


}
