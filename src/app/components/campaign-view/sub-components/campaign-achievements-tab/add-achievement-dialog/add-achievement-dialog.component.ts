import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddRuleDialogComponent } from '../../campaign-rules-tab/add-rule-dialog/add-rule-dialog.component';

@Component({
  selector: 'app-add-achievement-dialog',
  templateUrl: './add-achievement-dialog.component.html',
  styleUrl: './add-achievement-dialog.component.scss'
})
export class AddAchievementDialogComponent {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddAchievementDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { achievement: any, characters: any[] }) {}

  public form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    dmNotes: '',
    icon: '',
    lastUpdate: new Date(),
    visible: false,
    reclamedBy: []
  });

  ngOnInit() {
    if (this.data.achievement) {
      this.form.patchValue(this.data.achievement);
    }
  }

  public confirm() {
    if (this.data.achievement) {
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
    if (this.data.achievement) {
      this.dialogRef.close({
        status: 'deleted',
        spell: this.form.value
      })
    }
  }
}
