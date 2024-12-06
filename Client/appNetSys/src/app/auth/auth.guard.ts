import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { NotificacionService, TipoMessage } from "../shared/notificacion.service";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";

export class UserGuard {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  noti: NotificacionService = inject(NotificacionService);

  auth: boolean = false;
  user: any;

  constructor() {
    this.authService.decodeToken.subscribe((user: any) => {
      this.user = user;
    });

    this.authService.isAuthenticated.subscribe((auth) => {
      this.auth = auth;
    });
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.checkUserLogin(route);
  }

  public checkUserLogin(route: ActivatedRouteSnapshot): boolean {
    if (this.auth) {
      const userRole = this.user.rol;
      if (
        route.data['rol'] &&
        route.data['rol'].length &&
        !route.data['rol'].includes(userRole)
      ) {
        this.noti.mensaje(
          'Usuario',
          `Usuario sin permisos para acceder`,
          TipoMessage.warning,
        );
        this.router.navigate(['/notfound']);  // Cambié la redirección a notfound
        return false;
      }
      return true;
    } else {
      if(!this.authService.isLogin){
        this.router.navigate(['/login']);  // Cambié la redirección al login
      }
      return false;
    }
  }
}

export const AuthGuard: CanActivateFn = (route, state) => {
  let userGuard = new UserGuard();
  return userGuard.checkUserLogin(route);
};
