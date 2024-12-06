import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';

@Component({
  selector: 'app-ftth-historial-estado',
  templateUrl: './ftth-historial-estado.component.html',
  styleUrls: ['./ftth-historial-estado.component.css']
})
export class FtthHistorialEstadoComponent {
  ftthId: number | null = null;
  datos: any;
  datosC: any; 
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = ['Fecha', 'Tipo' ];

  filteredData: any;

  rNombre: any;
  rCloud: any;
  rCondominio: any;
  rCasa: any; 
  rEstado: any;

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
        this.ftthId = +id;
      }
    });

    this.fetchHistorial(); 
    this.fetchFtth(); 
  }

  fetchFtth() {
    this.gService
      .get('ftth/ftth', this.ftthId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.datos = response;

        this.rNombre = this.datos.infoCliente.nombre;
        this.rCondominio =
          this.datos.infoCliente?.Cliente_Condominio[0].condominio?.zona;
        this.rCasa =
          this.datos.infoCliente?.Cliente_Condominio[0].condominio?.numCasa;
        this.rCloud = this.datos.cloudMonitoreo;
        this.rEstado = this.datos.estado.nombre; 
      });
  }

  fetchHistorial() {
    this.gService
      .list(`ftth/reporteE/${this.ftthId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.datosC = response;

        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
  }

  updateTable(data: any) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  exportToPDF(): void {
    const contentToExport = document.querySelector(
      '.content-to-export'
    ) as HTMLElement;
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
            pageCanvas.height = Math.min(
              canvas.height - position,
              (canvas.width * (pdfHeight - 20)) / pdfWidth
            );

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
              pdf.addImage(
                pageData,
                'PNG',
                10,
                10,
                imgWidth,
                (pageCanvas.height * imgWidth) / pageCanvas.width
              );
              position += pageCanvas.height;
            }
          }
        }

        document.body.removeChild(container);
        pdf.save('Historial_Servicio.pdf');
      });
    } else {
      console.error('No se encontraron los elementos a exportar.');
    }
  }

}
