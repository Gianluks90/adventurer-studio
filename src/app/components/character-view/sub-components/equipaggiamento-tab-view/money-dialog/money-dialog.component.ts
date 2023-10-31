import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-money-dialog',
  templateUrl: './money-dialog.component.html',
  styleUrls: ['./money-dialog.component.scss']
})
export class MoneyDialogComponent {

  constructor(
    private formService: FormService, @Inject(MAT_DIALOG_DATA) public data: { group: any },
    private dialogRef: MatDialogRef<MoneyDialogComponent>) { }

  public close() {
    this.dialogRef.close({ status: 'success', newValue: this.data.group });
  }
}
