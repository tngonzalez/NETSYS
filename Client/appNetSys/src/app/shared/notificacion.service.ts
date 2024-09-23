import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

export enum TipoMessage {
  error,
  info,
  success,
  warning,
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  options: Partial<IndividualConfig>;

  constructor(private toastr: ToastrService, private router: Router) {
    this.options = this.toastr.toastrConfig;
    this.options.enableHtml = true;
    this.options.positionClass = 'toast-top-right';
    this.options.timeOut = 2000; // Tiempo en milisegundos (5 segundos en este caso)
    this.options.closeButton = true;
  }

  public mensaje(titulo: string, mensaje: string, tipo: TipoMessage) {
    this.toastr.show(
      mensaje,
      titulo,
      this.options,
      'toast-' + TipoMessage[tipo]
    );
  }

  public mensajeRedirect(
    titulo: string,
    mensaje: string,
    tipo: TipoMessage,
    url: string
  ) {
    this.toastr
      .show(mensaje, titulo, this.options, 'toast-' + TipoMessage[tipo])
      .onHidden.subscribe(() => this.router.navigateByUrl(url));
  }
}
