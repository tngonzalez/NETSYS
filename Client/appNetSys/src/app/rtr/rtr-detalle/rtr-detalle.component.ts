import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-rtr-detalle',
  templateUrl: './rtr-detalle.component.html',
  styleUrl: './rtr-detalle.component.css'
})
export class RtrDetalleComponent {
  isVisible = false; 
  routerForm!: FormGroup;
  routerData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  @Output() routerDetalleModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
  ) {}

  ngOnInit(): void {
    this.routerForm = this.fb.group({
      id: [''],
      estado: [''],
      activo: [''],
      serie: [''],
      macAddress: [''],
      tipoDispositivo: [''],

    });
  }

  openModal(id?: any) {
    this.isVisible = true;
    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
    }
  }

  closeModal() {
    this.routerDetalleModal.emit();
    this.isVisible = false;
  }

  loadData(id: any) {
   this.gService
   .get('router/router', id)
   .pipe(takeUntil(this.destroy$))
   .subscribe((data: any) => {
     this.routerData = data;

     this.routerForm.setValue({
       id: this.routerData.id,
       activo: this.routerData.activo,
       serie: this.routerData.serie,
       macAddress: this.routerData.macAddress,
       estado: this.routerData.estado,
       tipoDispositivo: this.routerData.tipoDispositivo,
     });
   });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset(){
    this.routerForm.reset(); 
  }
  
}
