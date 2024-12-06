import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-ont-detalle',
  templateUrl: './ont-detalle.component.html',
  styleUrls: ['./ont-detalle.component.css']
})
export class OntDetalleComponent {
  ontId: number | null = null;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  currentDate: Date = new Date();

  filteredData: any;
  rActivo: any;
  rSerie: any;
  rMAC: any;
  rMonitoreo: any;
  rCliente : any;
  rTipo: any;

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.ontId = +id;
      }
    });

    this.fetch();
  }

  fetch() {
    this.gService
      .list(`ont/reporte/${this.ontId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.datos = response;

        this.fillReciente(this.datos[0]);
      });
  }

  fillReciente(data: any) {

    if(data) {
      this.rSerie = data.numSN;
      this.rActivo = data.numActivo;
      this.rMAC = data.macAddress;
  
      this.rMonitoreo = data.monitoreo;
      this.rCliente = data.nombreCliente;
      this.rTipo = data.tipoCliente;
  
    } else {
      console.error; 
    }
  }
  exportToPDF(): void {
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
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        if (imgHeight <= pdfHeight - 20) {

          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        } else {

          let y = 10;
          let position = 0;
  
          while (position < canvas.height) {
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = Math.min(canvas.height - position, (canvas.width * (pdfHeight - 20)) / pdfWidth);
  
            const ctx = pageCanvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(
                canvas,
                0,
                position,
                canvas.width,
                pageCanvas.height,
                0,
                0,
                pageCanvas.width,
                pageCanvas.height
              );
  
              const pageData = pageCanvas.toDataURL('image/png');
              if (position > 0) pdf.addPage();
              pdf.addImage(pageData, 'PNG', 10, 10, imgWidth, (pageCanvas.height * imgWidth) / pageCanvas.width);
              position += pageCanvas.height;
            }
          }
        }
  
        document.body.removeChild(container);
        pdf.save('ONT_datos.pdf');
      });
    } else {
      console.error('No se encontraron los elementos a exportar.');
    }
  }

  
  
}
