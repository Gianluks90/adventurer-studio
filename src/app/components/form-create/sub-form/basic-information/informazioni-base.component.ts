import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-informazioni-base',
  templateUrl: './informazioni-base.component.html',
  styleUrls: ['./informazioni-base.component.scss'],
})
export class InformazioniBaseComponent {
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
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.groupInfo = form.get('informazioniBase') as FormGroup;
        console.log(this.groupInfo);

        this.groupCaratteristiche = form.get('caratteristicheFisiche') as FormGroup;
        this.classi = this.groupInfo.get('classi') as FormArray;
        this.risorseAggiuntive = this.groupInfo.get('risorseAggiuntive') as FormArray;
      }
    });
  }

  public onPicSelected(event: any) {
    if (event.target.files[0].size > 500000) {
      this.notification.openSnackBar('Immagine troppo grande, dim. massima: 500kb.', 'warning', 3000, 'yellow');
    } else {
      this.formService.uploadImage(event).then((result) => {
        if (result !== 'error') {
          this.groupInfo?.patchValue({
            urlImmaginePersonaggio: result.url,
            nomeImmaginePersonaggio: result.name,
          });
          this.formService.updatePicCharacter(window.location.href.split('/').pop(), result.url, result.name).then(() => {
            this.notification.openSnackBar('Immagine caricata con successo!', 'add_photo_alternate', 3000, 'limegreen');
          });
        } else {
          this.notification.openSnackBar('Errore nel caricamento dell\'immagine', 'error');
        }
      })
    }
  }

  public deletePic(nomeImmagine: string) {
    this.formService.deleteImage(nomeImmagine).then((result) => {
      if (result === 'success') {
        this.groupInfo?.patchValue({
          urlImmaginePersonaggio: '',
          nomeImmaginePersonaggio: '',
        })
        this.formService.updatePicCharacter(window.location.href.split('/').pop(), '', '').then(() => {
          this.notification.openSnackBar('Immagine eliminata con successo', 'check');
        });
      }
    });
  }

  public jumpToSpecificStep(index: number) {
    this.stepper.selectedIndex = index;
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
    });
    this.risorseAggiuntive.push(risorsa);
  }

  public deleteRisorsa(index: number) {
    this.risorseAggiuntive.removeAt(index);
  }

  public setValoreAttuale(index: number, value: any) {
    const risorsa = this.risorseAggiuntive.at(index);
    risorsa.patchValue({
      valoreAttuale: parseInt(value)
    });
  }
}
