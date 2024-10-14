import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ont-detalle',
  templateUrl: './ont-detalle.component.html',
  styleUrls: ['./ont-detalle.component.css']
})
export class OntDetalleComponent {

  @Output() ontDetalleModal: EventEmitter<void> = new EventEmitter<void>();

  openModal(id: any) {
    throw new Error('Method not implemented.');
  }

}
