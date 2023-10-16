import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss'],
})
export class BasicInformationComponent {
  public groupInfo: FormGroup | null = null;
  public groupCaratteristiche: FormGroup | null = null;
  public classi: FormArray;

  constructor(
    public formService: FormService, 
    private stepper: MatStepper,
    private fb: FormBuilder) { 
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
      alert("Dimensione dell'immagine troppo grande (massimo 3 MB)");
    } else {
      this.formService.uploadImage(event).then((result) => {
        if (result !== 'error') {
          this.groupInfo?.patchValue({
            urlImmaginePersonaggio: result,
            nomeImmaginePersonaggio: event.target.files[0].name,
          })
          alert('Immagine caricata con successo');
        } else {
          alert('Errore nel caricamento dell\'immagine');
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
        alert('Immagine eliminata con successo');
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
