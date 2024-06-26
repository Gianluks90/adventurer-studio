import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { Item } from 'src/app/models/item';
import { RollDiceService } from 'src/app/services/roll-dice.service';
import { DddiceService } from 'src/app/services/dddice.service';
import { CharacterService } from 'src/app/services/character.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-character-view-status',
  templateUrl: './character-view-status.component.html',
  styleUrls: ['./character-view-status.component.scss']
})
export class CharacterViewStatusComponent {

  public characterData: any;
  public editModeData: boolean = false;

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

  public CA: string = '';
  public CAShield: string = '';

  public intuizionePassiva: number = 0;
  public percezionePassiva: number = 0;
  public indagarePassiva: number = 0;

  public parametriVitaliForm: FormGroup | null = null;

  public dadiVitaData: any[] = [];
  public risorseAggiuntiveData: any[] = [];

  constructor(
    private formService: FormService,
    private rollService: RollDiceService,
    public diceService: DddiceService,
    private charService: CharacterService,
    private notification: NotificationService) { }

  @Input() set character(character: any) {
    this.characterData = character;
    this.initCaratteristiche();
    this.initTiriSalvezza();
    // this.initCA();
    this.initProvePassive();

    this.dadiVitaData = character.parametriVitali.dadiVita;
    this.risorseAggiuntiveData = character.informazioniBase.risorseAggiuntive;
    this.risorseAggiuntiveData.push({
      color: 'yellow',
      nome: 'Ispirazione',
      used: [character.ispirazione],
      valoreAttuale: 1,
      valoreMassimo: 1,
    })
  }

  @Input() set editMode(editMode: boolean) {
    this.editModeData = editMode;
  }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.parametriVitaliForm = form.get('parametriVitali') as FormGroup;
      }
    });
  }

  public initCaratteristiche(): void {
    this.modForza = Math.floor((this.characterData.caratteristiche.forza - 10) / 2) > 0 ? '+' + Math.floor((this.characterData.caratteristiche.forza - 10) / 2) : Math.floor((this.characterData.caratteristiche.forza - 10) / 2) + '';
    this.modDestrezza = Math.floor((this.characterData.caratteristiche.destrezza - 10) / 2) > 0 ? '+' + Math.floor((this.characterData.caratteristiche.destrezza - 10) / 2) : Math.floor((this.characterData.caratteristiche.destrezza - 10) / 2) + '';
    this.modCostituzione = Math.floor((this.characterData.caratteristiche.costituzione - 10) / 2) > 0 ? '+' + Math.floor((this.characterData.caratteristiche.costituzione - 10) / 2) : Math.floor((this.characterData.caratteristiche.costituzione - 10) / 2) + '';
    this.modIntelligenza = Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2) > 0 ? '+' + Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2) : Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2) + '';
    this.modSaggezza = Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2) > 0 ? '+' + Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2) : Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2) + '';
    this.modCarisma = Math.floor((this.characterData.caratteristiche.carisma - 10) / 2) > 0 ? '+' + Math.floor((this.characterData.caratteristiche.carisma - 10) / 2) : Math.floor((this.characterData.caratteristiche.carisma - 10) / 2) + '';
  }

  public initTiriSalvezza(): void {
    const bonusCompetenza = this.characterData.tiriSalvezza.bonusCompetenza;

    const forza = Math.floor((this.characterData.caratteristiche.forza - 10) / 2);
    this.TSForza = this.characterData.tiriSalvezza.forza ? (forza + bonusCompetenza) : forza;
    this.TSForza = parseInt(this.TSForza) > 0 ? '+' + this.TSForza : this.TSForza;

    const destrezza = Math.floor((this.characterData.caratteristiche.destrezza - 10) / 2);
    this.TSDestrezza = this.characterData.tiriSalvezza.destrezza ? (destrezza + bonusCompetenza) : destrezza;
    this.TSDestrezza = parseInt(this.TSDestrezza) > 0 ? '+' + this.TSDestrezza : this.TSDestrezza;

    const costituzione = Math.floor((this.characterData.caratteristiche.costituzione - 10) / 2);
    this.TSCostituzione = this.characterData.tiriSalvezza.costituzione ? (costituzione + bonusCompetenza) : costituzione;
    this.TSCostituzione = parseInt(this.TSCostituzione) > 0 ? '+' + this.TSCostituzione : this.TSCostituzione;

    const intelligenza = Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2);
    this.TSIntelligenza = this.characterData.tiriSalvezza.intelligenza ? (intelligenza + bonusCompetenza) : intelligenza;
    this.TSIntelligenza = parseInt(this.TSIntelligenza) > 0 ? '+' + this.TSIntelligenza : this.TSIntelligenza;

    const saggezza = Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2);
    this.TSSaggezza = this.characterData.tiriSalvezza.saggezza ? (saggezza + bonusCompetenza) : saggezza;
    this.TSSaggezza = parseInt(this.TSSaggezza) > 0 ? '+' + this.TSSaggezza : this.TSSaggezza;

    const carisma = Math.floor((this.characterData.caratteristiche.carisma - 10) / 2);
    this.TSCarisma = this.characterData.tiriSalvezza.carisma ? (carisma + bonusCompetenza) : carisma;
    this.TSCarisma = parseInt(this.TSCarisma) > 0 ? '+' + this.TSCarisma : this.TSCarisma;
  }

  public initCA(): void {
    const equip = this.characterData.equipaggiamento as Array<Item>;
    equip.forEach((item: Item) => {
      if (item.CA > 0 && !item.shield && item.weared) {
        if (item.plusDexterity) {
          this.CA = (item.CA + Math.floor((this.characterData.caratteristiche.destrezza - 10) / 2)).toString();
        } else {
          this.CA = item.CA.toString();
        }
      }
      if (item.CA > 0 && item.shield && item.weared) {
        this.CAShield = '+ ' + item.CA;
      }
    });
    if (this.CA === '') {
      this.CA = this.characterData.CA
    }

  }

  public initProvePassive(): void {
    const intelligenza = Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2);
    const saggezza = Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2);

    this.indagarePassiva = 10 + intelligenza + (this.characterData.competenzaAbilita.indagare ? this.characterData.tiriSalvezza.bonusCompetenza : 0);
    this.percezionePassiva = 10 + saggezza + (this.characterData.competenzaAbilita.percezione ? this.characterData.tiriSalvezza.bonusCompetenza : 0);
    this.intuizionePassiva = 10 + saggezza + (this.characterData.competenzaAbilita.intuizione ? this.characterData.tiriSalvezza.bonusCompetenza : 0);

    this.indagarePassiva += this.characterData.competenzaAbilita.maestriaIndagare ? this.characterData.tiriSalvezza.bonusCompetenza : 0;
    this.percezionePassiva += this.characterData.competenzaAbilita.maestriaPercezione ? this.characterData.tiriSalvezza.bonusCompetenza : 0;
    this.intuizionePassiva += this.characterData.competenzaAbilita.maestriaIntuizione ? this.characterData.tiriSalvezza.bonusCompetenza : 0;
  }

  // public openHPDialog() {
  //   const characterId = window.location.href.split('/').pop();
  //   this.dialog.open(HealthPointDialogComponent, {
  //     width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
  //     data: {
  //       group: this.parametriVitaliForm,
  //     }
  //   }).afterClosed().subscribe((result: any) => {
  //     if (result.status === 'success') {
  //       this.characterData.parametriVitali = result.newValue.value;
  //       this.charService.updateCharacterPFById(characterId!, this.parametriVitaliForm).then(() => {
  //         this.notification.openSnackBar('Punti Ferita Aggiornati.', 'check', 3000, 'limegreen');
  //       });
  //     }
  //   });
  // }

  // public initDadiVita(): void {
  //   this.characterData.parametriVitali.dadiVita.forEach((dado: any) => {
  //     const dadiUsati = dado.usati;
  //     for (let i = 0; i < dado.quantita; i++) {
  //       this.dadiVitaData.push({
  //         tipologia: dado.tipologia,
  //         usato: dado.usati > i ? true : false,
  //         icon: './assets/dice/dice-' + dado.tipologia + '.svg'
  //       });
  //     }
  //   });
  // }

  // public updateDadiVita(index: number, type: string) {
  //   this.dadiVitaData.at(index).usato = !this.dadiVitaData.at(index).usato;
  //   const dadiVita = this.characterData.parametriVitali.dadiVita;
  //   dadiVita.forEach((dado: any) => {
  //     if (dado.tipologia === type) {
  //       dado.usati = this.dadiVitaData.at(index).usato ? dado.usati + 1 : dado.usati - 1;
  //     }
  //   });

  //   this.parametriVitaliForm.get('dadiVita').patchValue(dadiVita);
  //   const characterId = window.location.href.split('/').pop();
  //   this.charService.updateCharacterDadiVitaById(characterId, this.parametriVitaliForm).then(() => {
  //     this.notification.openSnackBar('Dadi Vita Aggiornati.', 'check', 3000, 'limegreen');
  //   });
  // }

  useRisorsa(risorsaIndex: number, index: number): void {
    const resource = this.risorseAggiuntiveData[risorsaIndex];
    if (!resource.used[index]) {
      const lastFalseIndex = resource.used.lastIndexOf(false);
      if (lastFalseIndex !== -1) {
        resource.used[lastFalseIndex] = true;

      }
    } else {
      const firstTrueIndex = resource.used.indexOf(true);
      if (firstTrueIndex !== -1) {
        resource.used[firstTrueIndex] = false;
      }
      this.risorseAggiuntiveData
    }
    if (resource.nome === 'Ispirazione') {
      this.charService.updateInspiration(this.characterData.id, resource.used[0]).then(() => {
        this.notification.openSnackBar('Ispirazione aggiornata.', 'check', 1000, 'limegreen');
      });
    } else {
      const risorse = this.risorseAggiuntiveData.filter((risorsa: any) => risorsa.nome !== 'Ispirazione');
      this.charService.updateAdditionalResources(this.characterData.id, risorse).then(() => {
        this.notification.openSnackBar('Risorsa aggiornata.', 'check', 1000, 'limegreen');
      });
    }
  }

  usaDadoVita(dadoVitaIndex: number, index: number): void {
    const dadoVita = this.dadiVitaData[dadoVitaIndex];

    if (!dadoVita.used[index]) {
      const modCostituzione = Math.floor((this.characterData.caratteristiche.costituzione - 10) / 2);
      this.rollService.rollFromCharView(dadoVita.tipologia, 'Dado vita, resupero punti ferita', modCostituzione, true);
      const lastFalseIndex = dadoVita.used.lastIndexOf(false);
      if (lastFalseIndex !== -1) {
        dadoVita.used[lastFalseIndex] = true;
      }
    } else {
      const firstTrueIndex = dadoVita.used.indexOf(true);
      if (firstTrueIndex !== -1) {
        dadoVita.used[firstTrueIndex] = false;
      }
    }
    this.charService.updateDadiVita(this.characterData.id, this.dadiVitaData).then(() => {
      // this.notification.openSnackBar('Dado vita aggiornato.', 'check', 1000, 'limegreen');
    });
  }

    public rollDice(message: string, modifier?: string): void {
      this.rollService.rollFromCharView('d20', message, Number(modifier));
    }

}
