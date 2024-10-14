import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notificacion.service';

@Component({
  selector: 'app-ont-delete',
  templateUrl: './ont-delete.component.html',
  styleUrls: ['./ont-delete.component.css']
})
export class OntDeleteComponent {
  isVisible = false; 
  idO: number = 0;

  respuesta: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() idOLT: number | null = null;
  @Output() ontDeleteModal: EventEmitter<void> = new EventEmitter<void>();

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

  deleteONT() {
    this.gService
      .delete('ont/eliminar', this.idO)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respuesta = data;
        this.noti.mensajeRedirect(
         'ONT • Eliminado',
          `El ONT seleccionado fue eliminado exitosamente. `,
          TipoMessage.success,
          `/ont`
        );
        this.ontDeleteModal.emit();
      });
    this.closeModal();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
