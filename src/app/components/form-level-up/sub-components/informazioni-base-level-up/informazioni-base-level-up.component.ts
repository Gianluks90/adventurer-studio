import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-informazioni-base-level-up',
  templateUrl: './informazioni-base-level-up.component.html',
  styleUrls: ['./informazioni-base-level-up.component.scss']
})
export class InformazioniBaseLevelUpComponent {

  public groupInfo: FormGroup | null = null;
  public groupCaratteristiche: FormGroup | null = null;
  public classi: FormArray;
  public risorseAggiuntive: FormArray;

  constructor(
    public formService: FormService, 
    private stepper: MatStepper,
    private fb: FormBuilder,
    private notification: NotificationService) { 
      this.classi = this.fb.array([]);
      this.risorseAggiuntive = this.fb.array([]);
    }

    ngOnInit(): void {
      this.formService.formLevelUpSubject.subscribe((form: any) => {
        if (form) {     
          this.groupInfo = form.get('informazioniBase') as FormGroup;
          this.classi = this.groupInfo.get('classi') as FormArray;
          this.risorseAggiuntive = this.groupInfo.get('risorseAggiuntive') as FormArray;
        }
      });
    }

    public addClasse() {
      const classe = this.fb.group({
        nome: ['', Validators.required],
        livello: [1, [Validators.max(20), Validators.required]],
        sottoclasse: '',
      });
      this.classi.push(classe);
    }
  
    public deleteClasse(index: number) {
      this.classi.removeAt(index);
    }

    public addRisorsa() {
      const risorsa = this.fb.group({
        nome: ['', Validators.required],
        valoreMassimo: [0, Validators.required],
        valoreAttuale: 0,
        used: [],
        color: ['', Validators.required]
      });
      this.risorseAggiuntive.push(risorsa);
    }
  
    public deleteRisorsa(index: number) {
      this.risorseAggiuntive.removeAt(index);
    }
  
    public setValoreAttuale(index: number, value: any) {
      const risorsa = this.risorseAggiuntive.at(index);
      const used = new Array(parseInt(value)).fill(false);
      risorsa.patchValue({
        valoreAttuale: parseInt(value),
        used: used
      });
    }
}
