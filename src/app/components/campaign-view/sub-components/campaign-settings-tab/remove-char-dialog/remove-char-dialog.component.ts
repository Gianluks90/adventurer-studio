import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-char-dialog',
  templateUrl: './remove-char-dialog.component.html',
  styleUrl: './remove-char-dialog.component.scss'
})
export class RemoveCharDialogComponent {
  
  constructor(public dialogRef: MatDialogRef<RemoveCharDialogComponent>) {}

  public confirm() {
    this.dialogRef.close('success');
  }
}
