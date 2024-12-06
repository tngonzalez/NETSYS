import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  user:any;
  constructor(public router: Router, public authservice: AuthService){
    this.authservice.decodeToken.subscribe((user: any) => {
      this.user = user;
    });
  }
  volver() : void{
    if(this.user){
      this.router.navigate(['/login'])
    }else{
      this.router.navigate(['/'])
    }
  }
}
