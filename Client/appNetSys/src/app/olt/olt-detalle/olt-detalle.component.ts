import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-olt-detalle',
  templateUrl: './olt-detalle.component.html',
  styleUrls: ['./olt-detalle.component.css']
})
export class OltDetalleComponent {
  
  @Output() oltDetalleModal: EventEmitter<void> = new EventEmitter<void>();

  openModal(id: any) {
    throw new Error('Method not implemented.');
  }

}
