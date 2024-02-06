import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-rule-dialog',
  templateUrl: './add-rule-dialog.component.html',
  styleUrl: './add-rule-dialog.component.scss'
})
export class AddRuleDialogComponent {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddRuleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { rule: any }) {}

  public form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    reference: '',
    lastUpdate: new Date(),
    visible: true
  });

  ngOnInit() {
    if (this.data.rule) {
      this.form.patchValue(this.data.rule);
    }
  }

  public confirm() {
    if (this.data.rule) {
      this.dialogRef.close({
        status: 'edited',
        rule: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        rule: this.form.value
      })
    }
  }

  delete() {
    if (this.data.rule) {
      this.dialogRef.close({
        status: 'deleted',
        spell: this.form.value
      })
    }
  }
}
