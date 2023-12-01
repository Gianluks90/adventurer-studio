import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      }
    });
  }

  addTrucchettoIncantesimo() {
    const trucchettoIncantesimo = this.fb.group({
      tipologia: ['trucchetto', Validators.required],
      nome: ['', Validators.required],
      scuola: ['', Validators.required],
      livello: [0, [Validators.required, Validators.min(0), Validators.max(9)]],
      tempoLancio: ['', Validators.required],
      gittata: ['', Validators.required],
      componenti: ['', Validators.required],
      formula: '',
      durata: ['', Validators.required],
      descrizione: ['', Validators.required],
      livelloSuperiore: '',
      riferimento: ''
    });
    this.trucchettiIncantesimi.push(trucchettoIncantesimo);
  }

  deleteTrucchettoIncantesimo(index: number) {
    this.trucchettiIncantesimi.removeAt(index);
  }

}
