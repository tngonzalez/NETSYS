import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService } from '../../shared/notificacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-ftth-create',
  templateUrl: './ftth-create.component.html',
  styleUrls: ['./ftth-create.component.css'],
})
export class FtthCreateComponent implements OnInit {
  isVisible = false;

  numero: any;
  nombre: any;
  zona: any;
  numCasa: any;
  potenciaRecepcion: any;
  numActivo: any;
  macAdress: any;
  numSN: any;
  idOLT: any;
  nombreZona: any;
  ip: any;
  idRouter: any;
  idTipo: any;
  idEstado: any;
  idBW: any;
  kbps: any;
  numOS: any;
  cajaDerivada: any;
  fechaInstalacion: any;
  comentario: any;
  agente: any;
  cloudMonitoreo: any;
  puertoNAT: any;

  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  ftthForm!: FormGroup;
  ftthData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;
  infoCliente: any;
  displayedColumns: string[] = ['nombre','numero', 'accion'];
  displayedRouter: string[] = ['activo', 'serie', 'macAddress', 'accion'];
  filteredData: any;

  olts: any[] = [];
  router: any[] = [];
  bw: any[] = [];
  servicios: any[] = [];
  subredes: any[] = [];
  selectedOLT: number = 0;
  selectedServices: number = 0;
  selectedBW: number = 0;
  
  createVisible: boolean = true;
  tableVisiblie: boolean = false;
  btnVisible: boolean = true;

  dataSource = new MatTableDataSource<any>();
  dataRouter = new MatTableDataSource<any>();
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() ftthCrearModal: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef;


  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  ngOnInit() {
    this.fetchOLTS();
    this.fetchCliente();
    this.fetchRouter();
    this.fetchBW();
    this.fetchServicios();
  }

  reactiveForm() {
    this.ftthForm = this.fb.group({
      id: [null, null],
      numero: [null, Validators.required],
      nombre: [null, Validators.required],
      zona: [null, Validators.required],
      numCasa: [null, null],
      potenciaRecepcion: [null, Validators.required],
      numActivo: [null, Validators.required],
      macAdress: [null, Validators.required],
      numSN: [null, Validators.required],
      idOLT: [null, Validators.required],
      nombreZona: [null, Validators.required],
      ip: [null, Validators.required],
      idRouter: [null, Validators.required],
      idTipo: [null, Validators.required],
      idEstado: [1],
      idBW: [null, Validators.required],
      kbps: [null, Validators.required],
      numOS: [null, Validators.required],
      cajaDerivada: [null, Validators.required],
      fechaInstalacion: [null, Validators.required],
      comentario: [null, Validators.required],
      agente: [null, Validators.required],
      cloudMonitoreo: [null, Validators.required],
      puertoNAT: [null, Validators.required],
    });
  }

  openModal() {
    this.isVisible = true;
    this.fetchSubredes(this.selectedOLT);
  }

  closeModal() {
    this.submitted = false;
    this.ftthForm.reset();
    this.ftthCrearModal.emit();
    this.isVisible = false;
    this.createVisible = true;
    this.btnVisible = true;
    this.tableVisiblie = false;
  }

  fetchServicios() {
    this.gService
      .list('service/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.servicios = response;
        console.log(this.servicios);

        if (this.servicios && this.servicios.length > 0) {
          this.ftthForm.patchValue({ idTipo: this.servicios[0].id });
          this.selectedServices = this.servicios[0].id;
        }

      });
  }

  fetchOLTS() {
    this.gService
      .list('olt/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.olts = response;
        console.log(this.olts);

        if (this.olts && this.olts.length > 0) {
          this.ftthForm.patchValue({ idOLT: this.olts[0].idOLT });
          this.selectedOLT = this.olts[0].idOLT;
          this.fetchSubredes(this.selectedOLT);
        }
      });
  }

  fetchCliente() {
    this.gService
      .list('ftth/info/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.infoCliente = response;
        console.log(this.infoCliente);
        this.dataSource = new MatTableDataSource(this.infoCliente);
        if (this.searchInput) {
          this.searchInput.nativeElement.value = '';
        }
      });
  }

  fetchRouter() {
    this.gService
      .list('router/estado/1')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.router = response;
        console.log(this.router);
        this.dataRouter = new MatTableDataSource(this.router);
        this.dataRouter.sort = this.sort;
        this.dataRouter.paginator = this.paginator;
      
      }, error => {
        console.error('Error Fetch ', error); 
      });
  }

  fetchBW() {
    this.gService
      .list('ftth/bw')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.bw = response;
        console.log(this.bw);

        
        if (this.bw && this.bw.length > 0) {
          this.ftthForm.patchValue({ idBW: this.bw[0].id});
          this.selectedBW = this.bw[0].id;
        }
      });
  }

  //Renderizar las subredes
  fetchSubredes(idOLT: number): void {
    this.gService
      .get('olt/red', idOLT)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.subredesDisponibles) {
          this.subredes = response.subredesDisponibles;

          if (this.subredes && this.subredes.length > 0) {
            this.ftthForm.patchValue({ ip: this.subredes[0] });
          }
        } else {
          this.subredes = [];
        }
        console.log(this.subredes);
      });
  }

  //Buscar por cliente - Tabla
  numberChange(event: any) {
    const numero = event.target.value.trim().toUpperCase();
    if (numero !== '') {
      this.filteredData = this.infoCliente.filter(
        (i: any) =>
          i.numero && i.numero.toString().toUpperCase().includes(numero)
      );
    } else {
      this.filteredData = this.infoCliente;
    }

    this.updateTable(this.filteredData);
  }

  //Dropdown
  onOLTChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);

    this.fetchSubredes(selectedId);
    console.log(selectedId);
  }

  onBWChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);

    this.ftthForm.patchValue({
      idBW: selectedId,
    });
  }

  onServiceChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);

    this.ftthForm.patchValue({
      idTipo: selectedId,
    });
  }

  //Busqueda de router por numActivo
  activeNumChange(event: any) {
    const numero = event.target.value.trim().toUpperCase();
    if (numero !== '') {
      this.filteredData = this.infoCliente.filter(
        (i: any) =>
          i.numActivo && i.numActivo.toString().toUpperCase().includes(numero)
      );
    } else {
      this.filteredData = this.infoCliente;
    }

    this.updateTable(this.filteredData);
  }

  searchCliente() {
    this.createVisible = false;
    this.btnVisible = false;
    this.tableVisiblie = true;
  }

  updateTable(data: any) {
    this.dataSource.data = data;
  }

  //Tables: Cliente + Router
  selectCliente(numero: number) {
    this.ftthForm.patchValue({
      numero: numero,
    });
  }

  selectRouter(id: number) {
    this.ftthForm.patchValue({
      idRouter: id,
    });

  }

  //Crear
  createFTTH(){
    console.log(this.ftthForm.value); 

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.ftthForm.reset();
  }

  // Control de Errores
  public errorHandling = (control: string, error: string) => {
    return (
      this.ftthForm.controls[control].hasError(error) &&
      this.ftthForm.controls[control].invalid &&
      (this.makeSubmit || this.ftthForm.controls[control].touched)
    );
  };
}
