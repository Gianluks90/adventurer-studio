import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HealthPointDialogComponent } from './health-point-dialog/health-point-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CharacterService } from 'src/app/services/character.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-health-bar',
  templateUrl: './health-bar.component.html',
  styleUrl: './health-bar.component.scss'
})

export class HealthBarComponent {

  @Input() set parametriVitali(parametriVitali: any) {
    if (parametriVitali) {
      this.parametriVitaliData.pfMax = parametriVitali.massimoPuntiFerita;
      this.parametriVitaliData.pf = parametriVitali.puntiFeritaAttuali;
      this.parametriVitaliData.pftMax = parametriVitali.massimoPuntiFeritaTemporanei;
      this.parametriVitaliData.pft = parametriVitali.puntiFeritaTemporaneiAttuali;
    }
  }

  @Input() set characterId(id: string) {
    this.idData = id;
  }

  @Input() set editMode(editMode: boolean) {
    this.editModeData = editMode;
  }

  constructor(private dialog: MatDialog, private platform: Platform, private charService: CharacterService, private notification: NotificationService) {

  }

  public parametriVitaliData: any = {
    pf: 0,
    pfMax: 0,
    pft: 0,
    pftMax: 0
  }

  public idData: string = '';
  public editModeData: boolean = false;

  public openHPDialog() {
    // const characterId = window.location.href.split('/').pop();
    this.dialog.open(HealthPointDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      data: {
        parametriVitali: this.parametriVitaliData,
      }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        this.parametriVitaliData = result.newValue;
        this.charService.updateCharacterPFById(this.idData, this.parametriVitaliData).then(() => {
          this.notification.openSnackBar('Punti Ferita Aggiornati.', 'check', 3000, '');
        });
      }
    });
  }

}
