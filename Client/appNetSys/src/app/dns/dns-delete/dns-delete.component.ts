import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notificacion.service';

@Component({
  selector: 'app-dns-delete',
  templateUrl: './dns-delete.component.html',
  styleUrl: './dns-delete.component.css'
})
export class DnsDeleteComponent {
  isVisible = false;
  idD: number = 0;

  respuesta: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() idDNS: number | null = null;
  @Output() dnsDeleteModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {}

  openModal(id: any) {
    this.idD = id;
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  deleteDNS(){
    this.gService
    .delete('dns/eliminar', this.idD)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.respuesta = data;
      this.noti.mensajeRedirect(
        'DNS • Eliminado',
        `El dispositivo seleccionado fue eliminado exitosamente. `,
        TipoMessage.success,
        `/dns`
      );
      this.dnsDeleteModal.emit();
    });
  this.closeModal();
  }
}
