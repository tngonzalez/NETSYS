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
  correo: any;
  clave: any;
  macAddress: any;
  dns: any;

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
      correo: [null, Validators.required],
      clave: [null, Validators.required],
      macAddress: [null, Validators.required],
      dns: [null, Validators.required],
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
          this.dnsForm.controls['dns'].setValue(this.dataScanned);
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

        this.dnsForm.patchValue({
          id: this.dnsData.id,
          correo: this.dnsData.email,
          clave: this.dnsData.clave,
          dns: this.dnsData.dns,
          macAddress: this.dnsData.mac,
          nombre: this.dnsData.nombre,
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
        correo: this.dnsForm.value.correo,
        clave: this.dnsForm.value.clave,
        dns: this.dnsForm.value.dns,
        macAddress: this.dnsForm.value.macAddress,
      };

      this.gService
        .create('dns/crear', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            this.respuesta = response;
            this.noti.mensajeRedirect(
              'DNS • Creación',
              `${data.dns} ha sido creado con exito.`,
              TipoMessage.success,
              `/dns`
            );
            this.dnsFormModal.emit();
          },
          (error: any) => {
            if (error.status === 400) {
              this.noti.mensaje(
                'Error en la creación del DNS',
                error.error.mensaje,
                TipoMessage.error
              );
            }
          }
        );
      this.closeModal();
    } else {
      const data = {
        idDNS: this.idDNS,
        nombre: this.dnsForm.value.nombre || null,
        correo: this.dnsForm.value.correo,
        clave: this.dnsForm.value.clave,
        dns: this.dnsForm.value.dns,
        macAddress: this.dnsForm.value.macAddress,
      };

      this.gService
        .update('dns/actualizar', data)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respuesta = data;
          this.noti.mensajeRedirect(
            'DNS • Actualización',
            `${data.dns} ha sido actualizado con exito.`,
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
