import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-trucchetti-incantesimi',
  templateUrl: './trucchetti-incantesimi.component.html',
  styleUrls: ['./trucchetti-incantesimi.component.scss']
})
export class TrucchettiIncantesimiComponent {

  public form: FormGroup | null = null;
  public trucchettiIncantesimi: FormArray;

  constructor(public formService: FormService, private fb: FormBuilder) {
    this.trucchettiIncantesimi = this.fb.array([]);
  }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.form = form as FormGroup;
        this.trucchettiIncantesimi = this.form.controls['trucchettiIncantesimi'] as FormArray;
        console.log('form',this.form);

      }
    });
  }

  addTrucchettoIncantesimo() {
    const trucchettoIncantesimo = this.fb.group({
      nome: [''],
      descrizione: [''],
    });
    this.trucchettiIncantesimi.push(trucchettoIncantesimo);
  }

  deleteTrucchettoIncantesimo(index: number) {
    this.trucchettiIncantesimi.removeAt(index);
  }

}