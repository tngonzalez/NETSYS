import { Component, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-ftth-detalle',
  templateUrl: './ftth-detalle.component.html',
  styleUrl: './ftth-detalle.component.css',
})
export class FtthDetalleComponent {
  ftthId: number | null = null;
  datosCliente: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  filteredData: any;
  data: any;

  rClienteID: any;
  rOS: any;
  rNombreCliente: any;
  rCondominio: any;
  rCasa: any;
  rBW: any;

  rOLT: any;
  rPuertoOLT: any;
  rPuertoNAT: any;

  rCaja: any;
  rPotencia: any;

  rActivoONT: any;
  rSNONT: any;

  rActivoR: any;
  rSerieR: any;

  rIP: any;
  rFecha: any;

  rTipo: any;

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
        this.ftthId = +id;
      }
    });
    this.fetchFtth();
  }

  fetchFtth() {
    this.gService
      .get('ftth/ftth', this.ftthId)
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
        this.rBW = this.data.bw.nombre;
        this.rOLT = this.data.rgestor.olt.numOLT;
        this.rPuertoOLT = this.data.rgestor.olt.ODF;
        this.rPuertoNAT = this.data.rgestor.olt.puertoNAT;
        this.rCaja = this.data.cajaDerivada;
        this.rPotencia = this.data.potenciaRecepcion;

        this.rActivoONT = this.data.ont.numActivo;
        this.rSNONT = this.data.ont.numSN;

        this.rActivoR = this.data.rcasa.numActivo;
        this.rSerieR = this.data.rcasa.serie;

        this.rIP = this.data.rgestor.subred.ip;

        this.rFecha = this.data.fechaInstalacion;

        this.rTipo = this.data.tipoCliente.nombre; 
      });
  }

  //Método para exportar la información de encabezado y los datos de la tabla
  exportToPNG(): void {
    const contentToExport = document.querySelector('.content-to-export') as HTMLElement;
  
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
        link.download = 'ALTAS.png';
        link.click(); 
  
        document.body.removeChild(container);
      });
    } else {
      console.error('No se encontraron los elementos a exportar.');
    }
  }

  redirectCondominio() {
    this.router.navigate(['/ftth/condominio/', this.ftthId], {
      relativeTo: this.route,
    });
  }

  redirectHistorial() {
    this.router.navigate(['/ftth/historial/', this.ftthId], {
      relativeTo: this.route,
    });
  }

}  
