import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../shared/notificacion.service';

@Component({
  selector: 'app-olt-delete',
  templateUrl: './olt-delete.component.html',
  styleUrls: ['./olt-delete.component.css'],
})
export class OltDeleteComponent {
  isVisible = false;
  idO: number = 0;

  respuesta: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() idOLT: number | null = null;
  @Output() oltDeleteModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {}

  openModal(id: any) {
    this.idO = id;
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  deleteOLT() {
    this.gService
      .delete('olt/eliminar', this.idO)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respuesta = data;
        console.log(data);
        this.noti.mensajeRedirect(
          'OLT eliminado',
          `El OLT seleccionado fue eliminado exitosamente. `,
          TipoMessage.success,
          `/olt`
        );
        this.oltDeleteModal.emit();
      });
    this.closeModal();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
