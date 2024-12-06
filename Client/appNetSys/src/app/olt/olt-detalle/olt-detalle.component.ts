import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-olt-detalle',
  templateUrl: './olt-detalle.component.html',
  styleUrls: ['./olt-detalle.component.css'],
})
export class OltDetalleComponent implements OnInit {
  oltId: number | null = null;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = ['clienteNombre', 'cloudMonitoreo', 'subredIP'];

  currentDate: Date = new Date();

  filteredData: any;
  rNombre: any;
  rSegmento: any;
  rIP: any;
  rODF: any;
  rPuerto: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
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
        this.oltId = +id;
      }
    });

    this.fetch();
  }

  fetch() {
    this.gService
      .list(`olt/reporte/${this.oltId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.datos = response;

        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.fillReciente(this.datos[0]);
      });
  }

  fillReciente(data: any) {
    if(data) {
      this.rNombre = data.nombreTipo;
      this.rSegmento = data.segmentoZona;
      this.rIP = data.ipGeneral;
      this.rODF = data.ODF;
      this.rPuerto = data.puertoNAT;
    } else {
      console.error; 
    }
  }

  updateTable(data: any) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  exportToPDF(): void {
    const contentToExport = document.querySelector('.content-to-export') as HTMLElement;
    const tableScroll = document.querySelector('.exportPDF') as HTMLElement;
  
    if (contentToExport && tableScroll) {

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '100%';
      document.body.appendChild(container);
  

      const clonedHeader = contentToExport.cloneNode(true) as HTMLElement;
      const clonedTable = tableScroll.cloneNode(true) as HTMLElement;
      container.appendChild(clonedHeader);
      container.appendChild(clonedTable);
  
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
        pdf.save('datos_olt.pdf');
      });
    } else {
      console.error('No se encontraron los elementos a exportar.');
    }
  }

}
