import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-health-point-dialog',
  templateUrl: './health-point-dialog.component.html',
  styleUrls: ['./health-point-dialog.component.scss']
})
export class HealthPointDialogComponent {

  public hpForm = this.fb.group({
    value: [0, Validators.pattern('^[0-9]*$')],
    valueTemp: [0, Validators.pattern('^[0-9]*$')],
  });

  constructor(private formService: FormService, @Inject(MAT_DIALOG_DATA) public data: { group: FormGroup },
    private dialogRef: MatDialogRef<HealthPointDialogComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log(this.data.group.value);
    
  }

  public add() {
    const pfAttuali = this.data.group.value.puntiFeritaAttuali;
    const pfMassimi = this.data.group.value.massimoPuntiFerita;
    if (pfAttuali + this.hpForm.value.value > pfMassimi) {
      this.data.group.get('puntiFeritaAttuali')?.setValue(pfMassimi);
    } else {
      this.data.group.get('puntiFeritaAttuali')?.setValue(pfAttuali + this.hpForm.value.value);
    }
    this.hpForm.reset();
  }

  public remove() {
    const pfAttuali = this.data.group.value.puntiFeritaAttuali;
    if (pfAttuali - this.hpForm.value.value <= 0) {
      this.data.group.get('puntiFeritaAttuali')?.setValue(0);
    } else {
      this.data.group.get('puntiFeritaAttuali')?.setValue(pfAttuali - this.hpForm.value.value);
    }
    this.hpForm.reset();
  }

  public addTemp() {
    this.data.group.get('massimoPuntiFeritaTemporanei').setValue(this.hpForm.value.valueTemp);
    this.data.group.get('puntiFeritaTemporaneiAttuali')?.setValue(this.hpForm.value.valueTemp);
    this.hpForm.reset();
  }

  public removeTemp() {
    const pftAttuali = this.data.group.value.puntiFeritaTemporaneiAttuali;
    const pftMassimi = this.data.group.value.massimoPuntiFeritaTemporanei;

    if (pftAttuali - this.hpForm.value.valueTemp <= 0) {
      this.data.group.get('puntiFeritaTemporaneiAttuali')?.setValue(0);
      this.data.group.get('massimoPuntiFeritaTemporanei')?.setValue(0);
    } else {
      this.data.group.get('puntiFeritaTemporaneiAttuali')?.setValue(pftAttuali - this.hpForm.value.valueTemp);
    }
    this.hpForm.reset();
  }

  public close() {
    this.dialogRef.close({ status: 'success', newValue: this.data.group });
  }
}
