import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notificacion.service';

@Component({
  selector: 'app-ftth-delete',
  templateUrl: './ftth-delete.component.html',
  styleUrl: './ftth-delete.component.css',
})
export class FtthDeleteComponent {
  isVisible = false;
  idC: number = 0;

  respuesta: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() idCliente: number | null = null;
  @Output() ftthDeleteModal: EventEmitter<void> = new EventEmitter<void>();
 
  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {}

  openModal(id: any) {
    this.idC = id;
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }


deleteFTTH() {
  this.gService
    .delete('ftth/eliminar', this.idC)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.respuesta = data;
      this.noti.mensajeRedirect(
       'Cliente • Eliminado',
        `El cliente seleccionado fue eliminado exitosamente. `,
        TipoMessage.success,
        `/ftth`
      );
      this.ftthDeleteModal.emit();
    });
  this.closeModal();
}

ngOnDestroy() {
  this.destroy$.next(true);
  this.destroy$.complete();
}
}
