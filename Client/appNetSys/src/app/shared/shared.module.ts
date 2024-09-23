import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { SharedRoutingModule } from './shared-routing.module';
import { MessageDialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [MenuComponent,
    MessageDialogComponent],
  imports: [CommonModule,
            SharedRoutingModule,
  ],
  exports: [
    MenuComponent,
    MessageDialogComponent,
  ]
})
export class SharedModule {}
