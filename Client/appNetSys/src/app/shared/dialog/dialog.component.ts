// message-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-message-dialog',
    template: `
      <div class="dialog-header">
        <h1 mat-dialog-title>Información</h1>
      </div>
      <div mat-dialog-content>
        <p>{{ data.message }}</p>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onClose()">OK</button>
      </div>
    `,
    styles: [`
      .dialog-header {
        background-color: #3f51b5;
        color: white;
        padding: 16px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        text-align: center;
      }
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: bold;
      }
      div[mat-dialog-content] {
        text-align: center;
        margin: 20px 0;
        font-size: 16px;
        color: #333;
      }
      div[mat-dialog-actions] {
        display: flex;
        justify-content: center;
        padding: 8px 24px;
        border-top: 1px solid #eee;
      }
      button {
        background-color: #3f51b5;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
      }
      button:hover {
        background-color: #303f9f;
      }
    `]
  })
export class MessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
