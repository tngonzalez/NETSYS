import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  constructor(public router: Router, public authService: AuthService) {
    authService.logout();
    this.getOut();
  }

  getOut() {
    this.router.navigateByUrl('/');
  }
}
