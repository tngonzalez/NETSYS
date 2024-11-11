import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../shared/notificacion.service';

@Component({
  selector: 'app-dns-create',
  templateUrl: './dns-create.component.html',
  styleUrl: './dns-create.component.css',
})
export class DnsCreateComponent {
  isVisible = false;
  idDNS: any;
  nombre: any;
  usuario: any;
  clave: any;
  macAddress: any;
  dsn: any;

  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  dnsForm!: FormGroup;
  dnsData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  dataScanned: string = '';
  isScanningMac: boolean = true;
  scanTimeOut: any = null;

  //Creación/Actualización
  isCreate: boolean = true;
  titleForm: string = 'Crear';

  @Output() dnsFormModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.dnsForm = this.fb.group({
      id: [null, null],
      nombre: [null, null],
      usuario: [null, Validators.required],
      clave: [null, null],
      macAddress: [null, null],
      dsn: [null, null],
    });
  }

  isValid(key: string): boolean {
    const validKeys = /^[a-zA-Z0-9-]+$/; // Solo letras, números y guiones
    return validKeys.test(key);
  }

  //Escucha los eventos del teclado
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if (key === 'Shift') {
      return;
    }

    if (key === 'Enter') {
      clearTimeout(this.scanTimeOut);

      this.scanTimeOut = setTimeout(() => {
        if (this.isScanningMac) {
          this.dnsForm.controls['dsn'].setValue(this.dataScanned);
          this.isScanningMac = false;
        } else {
          this.dnsForm.controls['macAddress'].setValue(this.dataScanned);
          this.isScanningMac = true;
        }

        this.dataScanned = '';
      }, 200);
    }
  }

  openModal(id?: any) {
    this.isVisible = true;
    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
      this.idDNS = id;
      this.isCreate = false;
      this.titleForm = 'Actualizar';
    } else {
      this.isCreate = true;
      this.titleForm = 'Crear';
    }
  }

  closeModal() {
    this.submitted = false;
    this.dnsForm.reset();
    this.dnsFormModal.emit();
    this.isVisible = false;
  }

  loadData(id: any): void {
    this.isCreate = false;
    this.titleForm = 'Actualizar';
    this.idDNS = id;

    this.gService
      .get('dns/dns', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.dnsData = data;
        console.log(this.dnsData);

        this.dnsForm.patchValue({
          id: this.dnsData.id,
          nombre: this.dnsData.nombre,
          usuario: this.dnsData.usuario,
          clave: this.dnsData.clave,
          dsn: this.dnsData.serie,
          macAddress: this.dnsData.macAddress,
        });
      });
  }

  createDNS() {
    this.submitted = true;

    if (this.dnsForm.invalid) {
      return;
    }

    if (this.isCreate) {
      const data = {
        nombre: this.dnsForm.value.nombre || null,
        usuario: this.dnsForm.value.usuario,
        clave: this.dnsForm.value.clave,
        dsn: this.dnsForm.value.dsn || null,
        macAddress: this.dnsForm.value.macAddress || null,
      };

      this.gService
        .create('dns/crear', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            this.respuesta = response;
            this.noti.mensajeRedirect(
              'DSN • Creación',
              `${data.usuario} ha sido creado con exito.`,
              TipoMessage.success,
              `/dns`
            );
            this.dnsFormModal.emit();
          },
          (error: any) => {
            if (error.status === 400) {
              this.noti.mensaje(
                'Error en la creación del DSN',
                error.error.mensaje,
                TipoMessage.error
              );
            }
          }
        );
      this.closeModal();
    } else {
      const data = {
        idDSN: this.idDNS,
        nombre: this.dnsForm.value.nombre || null,
        usuario: this.dnsForm.value.usuario,
        clave: this.dnsForm.value.clave,
        dsn: this.dnsForm.value.dsn || null,
        macAddress: this.dnsForm.value.macAddress || null,
      };

      this.gService
        .update('dns/actualizar', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respuesta = data;
          this.noti.mensajeRedirect(
            'DSN • Actualización',
            `${data.usuario} ha sido actualizado con exito.`,
            TipoMessage.success,
            `/dns`
          );
          this.dnsFormModal.emit();
        });
      this.closeModal();
    }

    this.dnsFormModal.emit();
    this.closeModal();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.dnsForm.reset();
  }

  // Control de Errores
  errorHandling(control: string, error: string) {
    return (
      this.dnsForm.controls[control].hasError(error) &&
      (this.submitted || this.dnsForm.controls[control].touched)
    );
  }
}
