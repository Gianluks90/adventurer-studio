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

  constructor(
    public formService: FormService, 
    private stepper: MatStepper,
    private fb: FormBuilder,
    private notification: NotificationService) { 
      this.classi = this.fb.array([]);
    }

    ngOnInit(): void {
      this.formService.formLevelUpSubject.subscribe((form: any) => {
        if (form) {     
          this.groupInfo = form.get('informazioniBase') as FormGroup;
          // this.groupCaratteristiche = form.get('caratteristicheFisiche') as FormGroup;
          this.classi = this.groupInfo.get('classi') as FormArray;
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
}
