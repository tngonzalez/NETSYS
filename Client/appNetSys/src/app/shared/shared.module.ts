import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { SharedRoutingModule } from './shared-routing.module';
import { MessageDialogComponent } from './dialog/dialog.component';
import { LogoutComponent } from './logout/logout.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    MenuComponent, 
    MessageDialogComponent,
    LogoutComponent,
    NotFoundComponent,
  ],
  imports: [CommonModule, SharedRoutingModule],
  exports: [MenuComponent, MessageDialogComponent],
})
export class SharedModule {}
