import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../shared/notificacion.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit, OnDestroy {
  correo: string = '';
  contrasena: string = '';

  submitted = false;
  makeSubmit: boolean = false;
  userForm!: FormGroup;
  userData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    public fb: FormBuilder,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  ngOnInit() {}

  reactiveForm() {
    this.userForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.compose([Validators.required])],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    const formData = this.userForm.value;

    if (this.userForm.invalid) {
      this.noti.mensaje(
        'Inicio de sesión',
        `Credenciales incorrectos. Verificar nuevamente`,
        TipoMessage.error
      );
      return;
    }

    if (this.userForm.value) {
      this.authService
        .login(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: any) => {
            this.respuesta = data;
            this.noti.mensaje(
              'Inicio de Sesión',
              `Se ha logrado iniciar sesión con éxito.`,
              TipoMessage.success
            );
            this.router.navigate(['/main/']);
          },
          (error) => {
            this.noti.mensaje(
              'Inicio de sesión',
              `Credenciales incorrectos. Verificar nuevamente`,
              TipoMessage.error
            );
            return;
          }
        );
    }
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
