import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipEditedEvent } from '@angular/material/chips';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-parametri-vitali-level-up',
  templateUrl: './parametri-vitali-level-up.component.html',
  styleUrls: ['./parametri-vitali-level-up.component.scss']
})
export class ParametriVitaliLevelUpComponent {

  public group: FormGroup | null = null;
  public groupVita: FormGroup | null = null;
  public modDestrezza: number = 0;

  public dadiVita: FormArray;

  constructor(public formService: FormService, private fb: FormBuilder) {
    this.dadiVita = this.fb.array([]);
  }

  ngOnInit(): void {
    this.formService.formLevelUpSubject.subscribe((form: any) => {
      if (form) {
        this.group = form as FormGroup;
        this.groupVita = form.get('parametriVitali') as FormGroup;
        this.dadiVita = this.groupVita.controls['dadiVita'] as FormArray;

        this.group.get('caratteristiche')?.valueChanges.subscribe((value: any) => {
          this.modDestrezza = Math.floor((value.destrezza - 10) / 2);
          this.group?.get('iniziativa')?.setValue(this.modDestrezza);
        });

        this.groupVita.get('massimoPuntiFerita').valueChanges.subscribe((value: any) => {
          this.groupVita?.get('puntiFeritaAttuali')?.setValue(value);
        });
      }
    });
  }

  addDadoVita() {
    const dadoVita = this.fb.group({
      tipologia: ['', Validators.required],
      quantita: [0, Validators.required],
      usati: 0
    });
    this.dadiVita.push(dadoVita);
  }

  deleteDadoVita(index: number) {
    this.dadiVita.removeAt(index);
  }
}
