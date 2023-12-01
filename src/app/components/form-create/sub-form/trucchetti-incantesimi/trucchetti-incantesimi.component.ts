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
  public slotIncantesimi: FormArray;

  public slotFormVisibility = false;
  public slotIncantesimiForm = this.fb.group({
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    level6: 0,
    level7: 0,
    level8: 0,
    level9: 0,
  });

  constructor(public formService: FormService, private fb: FormBuilder) {
    this.trucchettiIncantesimi = this.fb.array([]);
    this.slotIncantesimi = this.fb.array([]);
  }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.form = form as FormGroup;
        this.trucchettiIncantesimi = this.form.controls['trucchettiIncantesimi'] as FormArray;
        this.slotIncantesimi = this.form.controls['slotIncantesimi'] as FormArray;
        this.patchSlotArrayForm();
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
      riferimento: '',
      preparato: false
    });
    this.trucchettiIncantesimi.push(trucchettoIncantesimo);
  }

  deleteTrucchettoIncantesimo(index: number) {
    this.trucchettiIncantesimi.removeAt(index);
  }

  patchSlotArrayForm() {
    this.slotIncantesimi.value.forEach((slot: any) => {
      this.slotIncantesimiForm.controls['level1'].setValue(slot.level1.max);
      this.slotIncantesimiForm.controls['level2'].setValue(slot.level2.max);
      this.slotIncantesimiForm.controls['level3'].setValue(slot.level3.max);
      this.slotIncantesimiForm.controls['level4'].setValue(slot.level4.max);
      this.slotIncantesimiForm.controls['level5'].setValue(slot.level5.max);
      this.slotIncantesimiForm.controls['level6'].setValue(slot.level6.max);
      this.slotIncantesimiForm.controls['level7'].setValue(slot.level7.max);
      this.slotIncantesimiForm.controls['level8'].setValue(slot.level8.max);
      this.slotIncantesimiForm.controls['level9'].setValue(slot.level9.max);
    });
  }

  toggleSlot() {
    this.slotFormVisibility = !this.slotFormVisibility;
  }

  updateSlot() {
    if (this.slotIncantesimiForm.valid) {
      this.slotIncantesimi.clear();
      const slotIncantesimi = this.fb.group({
        level1: {
          max: this.slotIncantesimiForm.controls['level1'].value,
          used: new Array(this.slotIncantesimiForm.controls['level1'].value).fill(false)
        },
        level2: {
          max: this.slotIncantesimiForm.controls['level2'].value,
          used: new Array(this.slotIncantesimiForm.controls['level2'].value).fill(false)
        },
        level3: {
          max: this.slotIncantesimiForm.controls['level3'].value,
          used: new Array(this.slotIncantesimiForm.controls['level3'].value).fill(false)
        },
        level4: {
          max: this.slotIncantesimiForm.controls['level4'].value,
          used: new Array(this.slotIncantesimiForm.controls['level4'].value).fill(false)
        },
        level5: {
          max: this.slotIncantesimiForm.controls['level5'].value,
          used: new Array(this.slotIncantesimiForm.controls['level5'].value).fill(false)
        },
        level6: {
          max: this.slotIncantesimiForm.controls['level6'].value,
          used: new Array(this.slotIncantesimiForm.controls['level6'].value).fill(false)
        },
        level7: {
          max: this.slotIncantesimiForm.controls['level7'].value,
          used: new Array(this.slotIncantesimiForm.controls['level7'].value).fill(false)
        },
        level8: {
          max: this.slotIncantesimiForm.controls['level8'].value,
          used: new Array(this.slotIncantesimiForm.controls['level8'].value).fill(false)
        },
        level9: {
          max: this.slotIncantesimiForm.controls['level9'].value,
          used: new Array(this.slotIncantesimiForm.controls['level9'].value).fill(false)
        },
      });
      this.slotIncantesimi.push(slotIncantesimi);
      this.toggleSlot();      
    }
  }
}
