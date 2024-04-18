import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-privilegio-tratto-dialog',
  templateUrl: './edit-privilegio-tratto-dialog.component.html',
  styleUrl: './edit-privilegio-tratto-dialog.component.scss'
})
export class EditPrivilegioTrattoDialogComponent {

  public form: FormGroup | null = null;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<EditPrivilegioTrattoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { privilegioTratto: any }) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      descrizione: ['', Validators.required],
      tag: [''],
      tipologia: ['', Validators.required],
      riferimento: [''],
    })
  }

  ngOnInit(): void {
    // console.log(this.data.privilegioTratto);
    this.form.patchValue(this.data.privilegioTratto);
  }

  public confirm(): void {
    this.dialogRef.close({ status: 'success', data: this.form.value });
  }
}
