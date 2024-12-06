import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notificacion.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent {
  isVisible = false;
  idU: number = 1;

  respuesta: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() idUser: number | null = null;
  @Output() userDeleteModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {}

  openModal(id: any) {
    this.idU = id;
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  deleteUser() {
    this.gService
      .delete('usuario/eliminar', this.idU)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respuesta = data;
        this.noti.mensajeRedirect(
         'Usuario • Eliminado',
          `El usuario seleccionado fue eliminado exitosamente. `,
          TipoMessage.success,
          `/usuario`
        );
        this.userDeleteModal.emit();
      });
    this.closeModal();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
