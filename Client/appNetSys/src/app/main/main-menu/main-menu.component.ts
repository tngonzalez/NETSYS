import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {

  constructor(
    private router: Router,
  ) {}

  redirectToFTTH(){
    this.router.navigate(['/dashboard']);
  }

  redirectToIP(){
    this.router.navigate(['/ip']);
  }

}
