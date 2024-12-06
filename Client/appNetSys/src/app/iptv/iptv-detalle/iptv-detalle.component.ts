import { Component, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';

@Component({
  selector: 'app-iptv-detalle',
  templateUrl: './iptv-detalle.component.html',
  styleUrls: ['./iptv-detalle.component.css'],
})
export class IptvDetalleComponent {
  iptvId: any;
  datosCliente: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  filteredData: any;
  data: any;

  rClienteID: any;
  rOS: any;
  rNombreCliente: any;
  rCondominio: any;
  rCasa: any;

  rCantidad: any;

  rMAC: any;
  rDSN: any;

  rUser: any;
  rPW: any;

  rFecha: any;

  rTipo: any;

  rConsecutivo: any;

  rInstalados: any;

  rTitulo: string = 'STB'; 


  dataSource = new MatTableDataSource<any>();

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.iptvId = +id;
      }
    });
    this.fetchFtth();
  }

  fetchFtth() {
    this.gService
      .get('iptv/reporte', this.iptvId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.data = response;

        this.rClienteID = this.data.infoCliente.numero;
        this.rOS = this.data.numOS;
        this.rNombreCliente = this.data.infoCliente.nombre;
        this.rCondominio =
          this.data.infoCliente?.Cliente_Condominio[0].condominio?.zona;
        this.rCasa =
          this.data.infoCliente?.Cliente_Condominio[0].condominio?.numCasa;

        this.rCantidad = this.data.cantidad;

        this.rMAC = this.data.dsn.macAddress;
        this.rDSN = this.data.dsn.dsn;

        this.rUser = this.data.dsn.usuario;
        this.rPW = this.data.dsn.clave;

        this.rConsecutivo = this.data.consecutivo;

        this.rInstalados = this.data.instalados;

        this.rFecha = this.data.fechaInstalacion;

        this.rTipo = this.data.tipoCliente;

        if(this.data.tipoCliente !== "Panica") {
          this.rTitulo = 'STB';
        } else {
          this.rTitulo = 'FIRE STICK'
        }
      });

  }

  //Método para exportar la información de encabezado y los datos de la tabla
  exportToPNG(): void {
    const contentToExport = document.querySelector(
      '.content-to-export'
    ) as HTMLElement;

    if (contentToExport) {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '100%';
      document.body.appendChild(container);

      const clonedHeader = contentToExport.cloneNode(true) as HTMLElement;
      container.appendChild(clonedHeader);

      html2canvas(container, {
        scale: 2,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'ALTAS_IPTV.png';
        link.click();

        document.body.removeChild(container);
      });
    } else {
      console.error('No se encontraron los elementos a exportar.');
    }
  }
}
