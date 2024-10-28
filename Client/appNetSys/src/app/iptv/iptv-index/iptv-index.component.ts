import { AfterViewInit, Component } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";

@Component({
  selector: 'app-iptv-index',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './iptv-index.component.html',
  styleUrl: './iptv-index.component.css'
})
export class IptvIndexComponent implements AfterViewInit {

  selectedStatus: any; 
  datos: any; 
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = [
    'fechaInstalacion',
    'tipoCliente',
    'cliente',
    'agente',
    'accion',
  ];
  filteredData: any;



  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

}
