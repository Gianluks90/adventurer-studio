import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
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

  public dadiVitaArray: FormArray | null = null;
  public dadiVita: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formLevelUpSubject.subscribe((form: any) => {
      if (form) {
        this.group = form as FormGroup;
        this.groupVita = form.get('parametriVitali') as FormGroup;

        this.dadiVitaArray = this.groupVita?.get('dadiVita') as FormArray;
        if (this.dadiVitaArray.value.length > 0) {
          this.dadiVita = this.dadiVitaArray.value;
        }

        this.group.get('caratteristiche')?.valueChanges.subscribe((value: any) => {
          this.modDestrezza = Math.floor((value.destrezza - 10) / 2);
          this.group?.get('iniziativa')?.setValue(this.modDestrezza);
        });
      }
    });
  }

  addDadoVita(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.dadiVita.push(value);
      this.dadiVitaArray?.patchValue(this.dadiVita);
    }
    event.chipInput!.clear();
  }

  removeDadoVita(input: any): void {
    const index = this.dadiVita.indexOf(input);
    if (index >= 0) {
      this.dadiVita.splice(index, 1);
      this.dadiVitaArray?.patchValue(this.dadiVita);
    }
  }

  editDadoVita(input: any, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeDadoVita(input);
      return;
    }

    const index = this.dadiVita.indexOf(input);
    if (index >= 0) {
      this.dadiVita[index] = value;
      this.dadiVitaArray?.patchValue(this.dadiVita);
    }
  }
}
