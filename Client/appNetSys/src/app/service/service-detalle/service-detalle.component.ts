import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-service-detalle',
  templateUrl: './service-detalle.component.html',
  styleUrl: './service-detalle.component.css'
})
export class ServiceDetalleComponent {

  @Output() serviceDetalleModal: EventEmitter<void> = new EventEmitter<void>();

  openModal(id: any) {
    throw new Error('Method not implemented.');
  }

}
