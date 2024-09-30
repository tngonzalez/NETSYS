import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ftth-update',
  templateUrl: './ftth-update.component.html',
  styleUrl: './ftth-update.component.css'
})
export class FtthUpdateComponent {

  @Output() ftthUpdateModal: EventEmitter<void> = new EventEmitter<void>();

  openModal(id: any) {
    throw new Error('Method not implemented.');
  }

}
