import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HealthPointDialogComponent } from './health-point-dialog/health-point-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-character-view-status',
  templateUrl: './character-view-status.component.html',
  styleUrls: ['./character-view-status.component.scss']
})
export class CharacterViewStatusComponent {

  public characterData: any;

  public modForza: string = '';
  public modDestrezza: string = '';
  public modCostituzione: string = '';
  public modIntelligenza: string = '';
  public modSaggezza: string = '';
  public modCarisma: string = '';

  public TSForza: string = '';
  public TSDestrezza: string = '';
  public TSCostituzione: string = '';
  public TSIntelligenza: string = '';
  public TSSaggezza: string = '';
  public TSCarisma: string = '';

  public intuizionePassiva: number = 0;
  public percezionePassiva: number = 0;
  public indagarePassiva: number = 0;

  public parametriVitaliForm: FormGroup | null = null;

  constructor(
    private dialog: MatDialog, 
    private platform: Platform, 
    private formService: FormService, 
    private notification: NotificationService,
    private charService: CharacterService) { }

  @Input() set character(character: any) {
    this.characterData = character;
    
    this.initCaratteristiche();
    this.initTiriSalvezza();
    this.initProvePassive();
  }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.parametriVitaliForm = form.get('parametriVitali') as FormGroup;
      }
    });
  }


  public initCaratteristiche(): void {
    this.modForza = Math.floor((this.characterData.caratteristiche.forza - 10) / 2) > 0 ? '+ ' + Math.floor((this.characterData.caratteristiche.forza - 10) / 2) : Math.floor((this.characterData.caratteristiche.forza - 10) / 2) + '';
    this.modDestrezza = Math.floor((this.characterData.caratteristiche.destrezza - 10) / 2) > 0 ? '+ ' + Math.floor((this.characterData.caratteristiche.destrezza - 10) / 2) : Math.floor((this.characterData.caratteristiche.destrezza - 10) / 2) + '';
    this.modCostituzione = Math.floor((this.characterData.caratteristiche.costituzione - 10) / 2) > 0 ? '+ ' + Math.floor((this.characterData.caratteristiche.costituzione - 10) / 2) : Math.floor((this.characterData.caratteristiche.costituzione - 10) / 2) + '';
    this.modIntelligenza = Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2) > 0 ? '+ ' + Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2) : Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2) + '';
    this.modSaggezza = Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2) > 0 ? '+ ' + Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2) : Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2) + '';
    this.modCarisma = Math.floor((this.characterData.caratteristiche.carisma - 10) / 2) > 0 ? '+ ' + Math.floor((this.characterData.caratteristiche.carisma - 10) / 2) : Math.floor((this.characterData.caratteristiche.carisma - 10) / 2) + '';
  }

  public initTiriSalvezza(): void {
    const bonusCompetenza = this.characterData.tiriSalvezza.bonusCompetenza;

    const forza = Math.floor((this.characterData.caratteristiche.forza - 10) / 2);
    this.TSForza = this.characterData.tiriSalvezza.forza ? (forza + bonusCompetenza) : forza;
    this.TSForza = parseInt(this.TSForza) > 0 ? '+ ' + this.TSForza : this.TSForza;

    const destrezza = Math.floor((this.characterData.caratteristiche.destrezza - 10) / 2);
    this.TSDestrezza = this.characterData.tiriSalvezza.destrezza ? (destrezza + bonusCompetenza) : destrezza;
    this.TSDestrezza = parseInt(this.TSDestrezza) > 0 ? '+ ' + this.TSDestrezza : this.TSDestrezza;

    const costituzione = Math.floor((this.characterData.caratteristiche.costituzione - 10) / 2);
    this.TSCostituzione = this.characterData.tiriSalvezza.costituzione ? (costituzione + bonusCompetenza) : costituzione;
    this.TSCostituzione = parseInt(this.TSCostituzione) > 0 ? '+ ' + this.TSCostituzione : this.TSCostituzione;

    const intelligenza = Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2);
    this.TSIntelligenza = this.characterData.tiriSalvezza.intelligenza ? (intelligenza + bonusCompetenza) : intelligenza;
    this.TSIntelligenza = parseInt(this.TSIntelligenza) > 0 ? '+ ' + this.TSIntelligenza : this.TSIntelligenza;

    const saggezza = Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2);
    this.TSSaggezza = this.characterData.tiriSalvezza.saggezza ? (saggezza + bonusCompetenza) : saggezza;
    this.TSSaggezza = parseInt(this.TSSaggezza) > 0 ? '+ ' + this.TSSaggezza : this.TSSaggezza;

    const carisma = Math.floor((this.characterData.caratteristiche.carisma - 10) / 2);
    this.TSCarisma = this.characterData.tiriSalvezza.carisma ? (carisma + bonusCompetenza) : carisma;
    this.TSCarisma = parseInt(this.TSCarisma) > 0 ? '+ ' + this.TSCarisma : this.TSCarisma;


  }

  public initProvePassive(): void {
    const intelligenza = Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2);
    const saggezza = Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2);
    
    this.indagarePassiva = 10 + intelligenza;
    this.percezionePassiva = 10 + saggezza;
    this.intuizionePassiva = 10 + saggezza;
  }

  public openHPDialog() {
    const characterId = window.location.href.split('/').pop();
    this.dialog.open(HealthPointDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      data: {
        group: this.parametriVitaliForm,
      }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        this.characterData.parametriVitali = result.newValue.value;
        console.log(this.parametriVitaliForm.value);
        this.charService.updateCharacterPFById(characterId!, this.parametriVitaliForm).then(() => {
          this.notification.openSnackBar('Punti Ferita Aggiornati.', 'favorite', 3000, 'limegreen');
        });
      }
    });
  }
}
