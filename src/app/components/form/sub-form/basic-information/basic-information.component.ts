import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss'],
})
export class BasicInformationComponent {
  public groupInfo: FormGroup | null = null;
  public groupCaratteristiche: FormGroup | null = null;

  constructor(public formService: FormService) { }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.groupInfo = form.get('informazioniBase') as FormGroup;
        this.groupCaratteristiche = form.get('caratteristicheFisiche') as FormGroup;
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
}
