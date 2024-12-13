import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notificacion.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent {
  isVisible = false;
  idUser: any;
  tipoRol: any;
  nombre: any;
  apellidos: any;
  correo: any;
  clave: any;

  formData: any;
  makeSubmit: boolean = false;
  activeRouter: any;
  submitted = false;
  genericService: any;

  changePass: boolean = false;

  userForm!: FormGroup;
  userData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;
  filteredData: any;

  statuses = [
    {
      id: 1,
      name: 'Support - L1',
    },
    {
      id: 2,
      name: 'Support - L2',
    },
  ];

  @Output() userSettings: EventEmitter<void> = new EventEmitter<void>();


  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  //Validaciones
  reactiveForm() {
    this.userForm = this.fb.group({
      id: [null, null],
      nombre: [null, Validators.required],
      apellidos: [null, Validators.required],
      tipoRol: [null, Validators.required],
      correo: [null, Validators.required],
      clave: [null, Validators.required],
    });
  }

  openModal(id?: any) {
    this.isVisible = true;
    

    if (id != undefined && !isNaN(Number(id))) {
      this.loadData(id);
      this.idUser = id;
    }
  }

  closeModal() {
    this.changePass =false;

    this.submitted = false;
    this.userForm.reset();
    this.userSettings.emit();
    this.isVisible = false;

  }

  loadData(id: any): void {
    this.idUser = id;

    this.gService
      .get('usuario/detail', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.userData = data;

        this.userForm.patchValue({
          idUser: this.userData.id,
          nombre: this.userData.nombre,
          apellidos: this.userData.apellidos,
          tipoRol: this.userData.tipoRol,
          correo: this.userData.correo,
          clave: this.userData.clave,
        });
      });
  }

  createUser() {
    this.submitted = true;

      const infoUsuario = {
        idUsuario: this.idUser,
        tipoRol: this.userForm.value.tipoRol,
        nombre: this.userForm.value.nombre,
        apellidos: this.userForm.value.apellidos,
        correo: this.userForm.value.correo,
        clave: this.userForm.value.clave,
      };

      this.gService
        .update('usuario/', infoUsuario)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            this.respuesta = response;
            this.noti.mensaje(
              'Usuario • Actualización',
              `Usuario actualizado con exito.`,
              TipoMessage.success
            );
            this.userSettings.emit();
          },
          (error: any) => {
            if (error.status === 400) {
              this.noti.mensaje(
                'Error en la actualización del usuario.',
                error.error.mensaje,
                TipoMessage.error
              );
              this.userForm.reset();
            }
          }
        );

    this.userSettings.emit();
    this.closeModal();
  }

  selectStatus(event: any) {
    const selectedId = parseInt(event.target.value, 10);

    this.tipoRol = selectedId;

    this.userForm.patchValue({
      tipoRol: selectedId,
    });

    console.log(this.tipoRol);
  }

  passwordChange() {
    this.changePass = !this.changePass;

    this.userForm.get('clave')?.setValue('');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.userForm.reset();
  }
  // Control de Errores

  errorHandling(control: string, error: string) {
    return (
      this.userForm.controls[control].hasError(error) &&
      (this.submitted || this.userForm.controls[control].touched)
    );
  }
}
