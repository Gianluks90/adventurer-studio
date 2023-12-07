import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-descrizione-background-tab-view',
  templateUrl: './descrizione-background-tab-view.component.html',
  styleUrls: ['./descrizione-background-tab-view.component.scss']
})
export class DescrizioneBackgroundTabViewComponent {

  public backgroundInfoData: any;

  public backgroundData: {
    trattiCaratteriali: string,
    ideali: string,
    legami: string,
    difetti: string,
  };

  public storiaData: string = '';

  public caratteristicheFisicheData: {
    eta: number,
    altezza: number,
    peso: number,
    occhi: string,
    carnagione: string,
    capelli: string,
  };

  public immaginePersonaggioData: any;

  constructor(private notification: NotificationService, private formService: FormService) { }

  @Input() set backgroundInfo(backgroundInfo: any) {
    this.backgroundInfoData = backgroundInfo;
  }

  @Input() set background(background: any) {
    this.backgroundData = background;
  }

  @Input() set storia(storia: string) {
    this.storiaData = storia;
  }

  @Input() set caratteristicheFisiche(caratteristicheFisiche: any) {
    this.caratteristicheFisicheData = caratteristicheFisiche;
  }

  @Input() set immaginePersonaggio(immaginePersonaggio: any) {
    this.immaginePersonaggioData = immaginePersonaggio;
  }

  @Output() pictureEmitter: EventEmitter<any> = new EventEmitter<any>();

  public onPicSelected(event: any) {
    if (event.target.files[0].size > 500000) {
      this.notification.openSnackBar('Immagine troppo grande, dim. massima: 500kb.', 'warning', 3000, 'yellow');
    } else {
      this.formService.uploadImage(event).then((result) => {
        if (result !== 'error') {
          // this.groupInfo?.patchValue({
          //   urlImmaginePersonaggio: result.url,
          //   nomeImmaginePersonaggio: result.name,
          // });
          this.pictureEmitter.emit({
            urlImmaginePersonaggio: result.url,
            nomeImmaginePersonaggio: result.name,
          })
          this.formService.updatePicCharacter(window.location.href.split('/').pop(), result.url, result.name).then(() => {
            this.notification.openSnackBar('Immagine caricata con successo!', 'add_photo_alternate', 3000, 'limegreen');
          });
        } else {
          this.notification.openSnackBar('Errore nel caricamento dell\'immagine', 'error');
        }
      })
    }
    (<HTMLInputElement>document.getElementById("file")).value = null;
  }

  public deletePic(nomeImmagine: string) {
    this.formService.deleteImage(nomeImmagine).then((result) => {
      if (result === 'success') {
        // this.groupInfo?.patchValue({
        //   urlImmaginePersonaggio: '',
        //   nomeImmaginePersonaggio: '',
        // })
        this.pictureEmitter.emit({
          urlImmaginePersonaggio: '',
          nomeImmaginePersonaggio: '',
        })
        this.formService.updatePicCharacter(window.location.href.split('/').pop(), '', '').then(() => {
          this.notification.openSnackBar('Immagine eliminata con successo', 'check');
        });
      }
    });
  }
}

