import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-iptv-general',
  templateUrl: './iptv-general.component.html',
  styleUrls: ['./iptv-general.component.css']
})
export class IptvGeneralComponent {
  selectedStatus: any;
  IPTVid: any; 
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = ['fechaInstalacion', 'nombre', 'cloudMonitoreo', 'accion'];
  filteredData: any;


  statuses = [
    { id: 0, name: 'Estado' },
    {
      id: 1,
      name: 'Activo',
    },
    {
      id: 2,
      name: 'Desactivado: Suspención',
    },
    {
      id: 3,
      name: 'Desactivado: Retiro',
    },
    {
      id: 4,
      name: 'Desactivado: Dañado',
    },
  ];

  servicios: any[] = [];
  selectedService: string | null = 'Zonas';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>();

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectedStatus = 1;
  }

  ngOnInit() {
    this.fetchFTTH();
    this.fetchServicios();

  }

  fetchFTTH() {
    this.gService
      .list('iptv/reporteF')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.datos = response;

        this.IPTVid = this.datos.idIPTV; 

        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  fetchServicios() {
    this.gService
      .list('service/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.servicios = response;

        this.servicios.unshift({ nombre: 'Zonas' });
      });
  }

  redirectDetalle(id:any) {
    this.router.navigate(['/iptv/', id], {
      relativeTo: this.route,
    });
  }

  clientChange(event: any) {
    const cliente = event.target.value.trim().toLowerCase();
    if (cliente !== '') {
      this.filteredData = this.datos.filter(
        (i: any) =>
          i.nombre && i.nombre.toString().toLowerCase().includes(cliente)
      );
    } else {
      this.filteredData = this.datos;
    }

    this.updateTable(this.filteredData);
  }


  statusChange(value: any, valueDeactivate?: any) {
    switch (value.value) {
      case '4': {
        this.filteredData = this.datos.filter(
          (data: any) => data.idEstado === 4
        );
        this.updateTable(this.filteredData);
        break;
      }
      case '3': {
        this.filteredData = this.datos.filter(
          (data: any) => data.idEstado === 3
        );
        this.updateTable(this.filteredData);
        break;
      }
      case '2': {
        this.filteredData = this.datos.filter(
          (data: any) => data.idEstado === 2
        );
        this.updateTable(this.filteredData);
        break;
      }
      case '1': {
        this.filteredData = this.datos.filter(
          (data: any) => data.idEstado === 1
        );
        this.updateTable(this.filteredData);
        break;
      }
      default: {
        this.updateTable(this.datos);
        break;
      }
    }
  }

  servicesChange(event: any) {
    const selectedService = event;

    if (selectedService === 'Zonas') {
      this.filteredData = this.datos;
    } else {
      this.filteredData = this.datos.filter(
        (i: any) => i.tipo && i.tipo.toString() === event
      );
    }
    this.updateTable(this.filteredData);
  }

  updateTable(data: any) {
    this.dataSource.data = data;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

    //Método para exportar la información de encabezado y los datos de la tabla
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
          pdf.save('IPTV_general.pdf');
        });
      } else {
        console.error('No se encontraron los elementos a exportar.');
      }
    }

}
