import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dns-detalle',
  templateUrl: './dns-detalle.component.html',
  styleUrls: ['./dns-detalle.component.css']
})
export class DnsDetalleComponent {
  
  @Output() dnsDetalleModal: EventEmitter<void> = new EventEmitter<void>();

  openModal(id: any) {
    throw new Error('Method not implemented.');
  }
}
