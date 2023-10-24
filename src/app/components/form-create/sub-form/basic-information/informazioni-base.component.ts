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

  constructor(
    public formService: FormService, 
    private stepper: MatStepper,
    private fb: FormBuilder,
    private notification: NotificationService) { 
      this.classi = this.fb.array([]);
    }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.groupInfo = form.get('informazioniBase') as FormGroup;
        this.groupCaratteristiche = form.get('caratteristicheFisiche') as FormGroup;
        this.classi = this.groupInfo.get('classi') as FormArray;
      }
    });
  }

  public onPicSelected(event: any) {
    if (event.target.files[0].size > 300000) {
      this.notification.openSnackBar('Immagine troppo grande, massimo 300kb', 'warning');
    } else {
      this.formService.uploadImage(event).then((result) => {
        if (result !== 'error') {
          this.groupInfo?.patchValue({
            urlImmaginePersonaggio: result,
            nomeImmaginePersonaggio: event.target.files[0].name,
          })
          this.notification.openSnackBar('Immagine caricata con successo', 'check');
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
        this.notification.openSnackBar('Immagine eliminata con successo', 'check');
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
}
