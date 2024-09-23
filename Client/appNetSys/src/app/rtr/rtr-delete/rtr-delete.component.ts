import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notificacion.service';

@Component({
  selector: 'app-rtr-delete',
  templateUrl: './rtr-delete.component.html',
  styleUrls: ['./rtr-delete.component.css'],
})
export class RtrDeleteComponent{
  isVisible = false;
  idR: number = 0;

  respuesta: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() idRouter: number | null = null;
  @Output() routerDeleteModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {}


  openModal(id: any) {
    this.idR = id;
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  deleteRouter() {

    this.gService
      .delete('router/eliminar', this.idR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respuesta = data;
        console.log(data); 
        this.noti.mensajeRedirect(
          'Router eliminado',
          `El router seleccionado fue eliminado exitosamente. `,
          TipoMessage.success,
          `/rtr`
        );
        this.routerDeleteModal.emit();
      });
    this.closeModal();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.complete(); 
  }
}
