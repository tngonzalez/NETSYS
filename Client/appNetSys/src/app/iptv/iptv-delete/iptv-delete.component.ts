import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notificacion.service';

@Component({
  selector: 'app-iptv-delete',
  templateUrl: './iptv-delete.component.html',
  styleUrls: ['./iptv-delete.component.css']
})
export class IptvDeleteComponent {
  isVisible = false; 
  idI: number = 0;

  respuesta: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() idIPTV: number | null = null;
  @Output() iptvDeleteModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {}

  openModal(id: any) {
    this.idI = id;
    this.isVisible = true; 
  }

  closeModal() {
    this.isVisible = false; 
  }
  
  deleteONT() {
    this.gService
      .delete('iptv/eliminar', this.idI)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respuesta = data;
        this.noti.mensajeRedirect(
         'IPTV • Eliminado',
          `El IPTV seleccionado fue eliminado exitosamente. `,
          TipoMessage.success,
          `/iptv`
        );
        this.iptvDeleteModal.emit();
      });
    this.closeModal();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  
}
