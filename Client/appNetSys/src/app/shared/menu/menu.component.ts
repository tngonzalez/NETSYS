import { Component } from '@angular/core';
import { navItems } from './menu-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  navItems = navItems;

  constructor(public router: Router){}

  onItemSelected(item: any){
    this.router.navigate([item.route]); 
  }
}
