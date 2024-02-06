import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-quest-dialog',
  templateUrl: './add-quest-dialog.component.html',
  styleUrl: './add-quest-dialog.component.scss'
})
export class AddQuestDialogComponent {
  public form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    lastUpdate: new Date(),
    // steps: this.fb.array([]),
    visible: false,
    completed: false,
    result: ''
  });

  // public steps: FormArray = new FormArray([]);

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddQuestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { quest: any }) { }

  ngOnInit() {
    if (this.data.quest) {
      this.form.patchValue(this.data.quest);
      // this.data.quest.steps.forEach((step: any) => {
      //   const stepForm = this.fb.group({
      //     text: [step.text, Validators.required],
      //     visible: step.visible
      //   });
      //   this.steps.push(stepForm);
      // });
      
    }
  }

  public confirm() {
    if (this.data.quest) {
      this.dialogRef.close({
        status: 'edited',
        quest: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        quest: this.form.value
      })
    }
  }

  // public addStep() {
  //   const step = this.fb.group({
  //     text: ['', Validators.required],
  //     visible: false
  //   });
  //   this.steps.push(step);
  //   (<FormArray>this.form.get('steps')).push(step);

  // }

  // public removeStep(index: number) {
  //   this.form.get('steps').removeAt(index);
  // }
}
