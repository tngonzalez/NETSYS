import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { GenericService } from '../../shared/generic.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit{

  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private gService: GenericService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    this.authService.decodeToken.subscribe((usuario: any) => {
      this.user = usuario;

      console.log(this.user);
    });

    if (!this.user) {
      const token = this.authService.getToken;
    }

  }


  redirectToFTTH(){
    this.router.navigate(['/dashboard']);
  }

  redirectToIP(){
    this.router.navigate(['/ip']);
  }

}
