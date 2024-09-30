import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ftth-delete',
  templateUrl: './ftth-delete.component.html',
  styleUrl: './ftth-delete.component.css'
})
export class FtthDeleteComponent {

  @Output() ftthDeleteModal: EventEmitter<void> = new EventEmitter<void>();

  openModal(id: any) {
    throw new Error('Method not implemented.');
  }

}
