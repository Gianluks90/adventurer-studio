import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrl: './add-item-dialog.component.scss'
})
export class AddItemDialogComponent {

  public form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    icon: ''
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: {inventory: Item[]}, private dialogRef: MatDialogRef<AddItemDialogComponent>, private fb: FormBuilder){
  }

  confirm() {
    this.dialogRef.close({
      status: 'success',
      item: this.form.value
    })
  }

}
