import { AfterViewInit, Component, NgModule, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-dashboard-index',
  templateUrl: './dashboard-index.component.html',
  styleUrls: ['./dashboard-index.component.css']
})

export class DashboardIndexComponent implements AfterViewInit {
  chart1: any;
  chart2: any;
  data: any = [];
  data2: any = [];
  user:any = null;
  

  title: string = 'nombre'; 

  destroy$: Subject<boolean> = new Subject<boolean>();

  isDropdownOpen = false;


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private gService: GenericService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authService.decodeToken.subscribe((usuario: any) => {
      this.user = usuario;

    });

    if (!this.user) {
      const token = this.authService.getToken;
    }

    this.fetchOpcion1();
    this.fetchOpcion2();
  }

  ngAfterViewInit() {
    const dropdownButton = document.getElementById('dropdownInformationButton');
    const dropdownMenu = document.getElementById('dropdownInformation');

    if (dropdownButton && dropdownMenu) {
      dropdownButton.addEventListener('click', () => {
        const isHidden = dropdownMenu.classList.contains('hidden');
        if (isHidden) {
          dropdownMenu.classList.remove('hidden');
        } else {
          dropdownMenu.classList.add('hidden');
        }
      });
    }
  }

  fetchOpcion1() {
    this.gService
      .list('ftth/reporteS')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.data = response;
          this.createBarChart1(); // Usar el gráfico 1
        },
        error: (err: any) => {
          console.error('Error al obtener los datos del reporte 1:', err);
        }
      });
  }

  fetchOpcion2() {
    this.gService
      .list('ftth/reporteSE')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.data2 = response;
          this.createBarChart2();
        },
        error: (err: any) => {
          console.error('Error al obtener los datos del reporte 2:', err);
        }
      });
  }

  createBarChart1() {
    if (this.chart1) {
      this.chart1.destroy();
    }

    if (!this.data || this.data.length === 0) {
      console.error('No hay datos disponibles para el gráfico 1.');
      return;
    }

    const labels = this.data.map((item: any) => item.tipoCliente);
    const activoData = this.data.map((item: any) => item.activo);
    const danandoData = this.data.map((item: any) => item.danando);
    const suspensionData = this.data.map((item: any) => item.suspension);
    const retiroData = this.data.map((item: any) => item.retiro);

    this.chart1 = new Chart('barChart1', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Activo',
            data: activoData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Dañado',
            data: danandoData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Suspensión',
            data: suspensionData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Retiro',
            data: retiroData,
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: labels,
            font: {
              size: 20
            },
            color: '#000000'

          }
        },
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createBarChart2() {
    if (this.chart2) {
      this.chart2.destroy();
    }

    if (!this.data2 || this.data2.length === 0) {
      console.error('No hay datos disponibles para el gráfico 2.');
      return;
    }

    const labels = this.data2.map((item: any) => item.tipoCliente);
    const activoData = this.data2.map((item: any) => item.activo);
    const danandoData = this.data2.map((item: any) => item.danando);
    const suspensionData = this.data2.map((item: any) => item.suspension);
    const retiroData = this.data2.map((item: any) => item.retiro);

    this.chart2 = new Chart('barChart2', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Activo',
            data: activoData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Dañado',
            data: danandoData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Suspensión',
            data: suspensionData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Retiro',
            data: retiroData,
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: labels,
            font: {
              size: 20
            },
            color: '#000000'
          }
        },
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  redirecUsuario() {
    this.router.navigate(['/usuario/'], {
      relativeTo: this.route,
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/logout']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();

    if (this.chart1) {
      this.chart1.destroy();
    }
    if (this.chart2) {
      this.chart2.destroy();
    }
  }
}
