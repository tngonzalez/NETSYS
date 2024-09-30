import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ftth-detalle',
  templateUrl: './ftth-detalle.component.html',
  styleUrl: './ftth-detalle.component.css'
})
export class FtthDetalleComponent {

  @Output() ftthDetalleModal: EventEmitter<void> = new EventEmitter<void>();

  openModal(id: any) {
    throw new Error('Method not implemented.');
  }

}
