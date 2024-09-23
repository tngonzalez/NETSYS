import { Component } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";

@Component({
  selector: 'app-dashboard-index',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard-index.component.html',
  styleUrl: './dashboard-index.component.css'
})
export class DashboardIndexComponent {

}
