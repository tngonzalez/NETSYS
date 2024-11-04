import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-iptv-detalle',
  templateUrl: './iptv-detalle.component.html',
  styleUrls: ['./iptv-detalle.component.css']
})
export class IptvDetalleComponent {
  
  @Output() iptvDetalleModal: EventEmitter<void> = new EventEmitter<void>();

}
