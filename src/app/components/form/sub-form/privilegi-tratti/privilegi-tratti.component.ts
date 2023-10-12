import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-privilegi-tratti',
  templateUrl: './privilegi-tratti.component.html',
  styleUrls: ['./privilegi-tratti.component.scss']
})
export class PrivilegiTrattiComponent {

  // public group: FormGroup = new FormGroup({});
  // public array: FormArray | null = null;

  public form: FormGroup | null = null;
  public privilegiTratti: FormArray;

  constructor(public formService: FormService, private fb: FormBuilder) {
    this.privilegiTratti = this.fb.array([]);
  }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.form = form;
        this.privilegiTratti = this.form.controls['privilegiTratti'] as FormArray;
      }
    });
  }

  // get privilegiTratti() {
  //   return this.form.controls['privilegiTratti'] as FormArray;
  // }

  addPrivilegioTratto() {
    const privilegioTratto = this.fb.group({
      nome: ['', Validators.required],
      tipologia: ['privilegio', Validators.required],
      descrizione: ['', Validators.required],
    });
    this.privilegiTratti.push(privilegioTratto);
  }

  deletePrivilegioTratto(index: number) {
    this.privilegiTratti.removeAt(index);
  }
}
