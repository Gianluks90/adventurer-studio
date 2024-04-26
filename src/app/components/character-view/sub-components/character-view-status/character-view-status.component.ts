import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { Item } from 'src/app/models/item';
import { RollDiceService } from 'src/app/services/roll-dice.service';
import { DddiceService } from 'src/app/services/dddice.service';
import { CharacterService } from 'src/app/services/character.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AddResourceDialogComponent } from './add-resource-dialog/add-resource-dialog.component';

@Component({
  selector: 'app-character-view-status',
  templateUrl: './character-view-status.component.html',
  styleUrls: ['./character-view-status.component.scss']
})
export class CharacterViewStatusComponent {

  public characterData: any;
  public editModeData: boolean = false;

  public CA: string = '';
  public CAShield: string = '';

  public intuizionePassiva: number = 0;
  public percezionePassiva: number = 0;
  public indagarePassiva: number = 0;

  public parametriVitaliForm: FormGroup | null = null;

  public dadiVitaData: any[] = [];
  public ispirazione: any;
  public risorseAggiuntiveData: any[] = [];

  constructor(
    private formService: FormService,
    private rollService: RollDiceService,
    public diceService: DddiceService,
    private charService: CharacterService,
    private notification: NotificationService,
    private matDialog: MatDialog) { }

  @Input() set character(character: any) {
    if (!character) return;

    this.characterData = character;
    this.dadiVitaData = character.parametriVitali.dadiVita;
    this.risorseAggiuntiveData = character.informazioniBase.risorseAggiuntive;
    this.ispirazione = {
      color: 'yellow',
      nome: 'Ispirazione',
      used: [character.ispirazione],
      valoreAttuale: 1,
      valoreMassimo: 1,
    }
    this.initProvePassive();
  }

  @Input() set editMode(editMode: boolean) {
    this.editModeData = editMode;
  }

  public initModCaratteristica(c: string): string {
    const mod = Math.floor((this.characterData.caratteristiche[c] - 10) / 2);
    return mod > 0 ? '+' + mod : mod + '';
  }

  public initTiroSalvezza(c: string): string {
    const bonusCompetenza = this.characterData.tiriSalvezza.bonusCompetenza;
    const mod = Math.floor((this.characterData.caratteristiche[c] - 10) / 2);
    const tiroSalvezza = this.characterData.tiriSalvezza[c] ? (mod + bonusCompetenza) : mod;
    return parseInt(tiroSalvezza) > 0 ? '+' + tiroSalvezza : tiroSalvezza + '';
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
    // if (resource.nome === 'Ispirazione') {
    //   this.charService.updateInspiration(this.characterData.id, resource.used[0]).then(() => {
    //     this.notification.openSnackBar('Ispirazione aggiornata.', 'check', 1000, 'limegreen');
    //   });
    // } else {
    // const risorse = this.risorseAggiuntiveData.filter((risorsa: any) => risorsa.nome !== 'Ispirazione');
    this.charService.updateAdditionalResources(this.characterData.id, this.risorseAggiuntiveData).then(() => {
      this.notification.openSnackBar('Risorsa aggiornata.', 'check', 1000, 'limegreen');
    });
    // }
  }

  public usaIspirazione(): void {
    const resource = this.ispirazione;
    if (!resource.used[0]) {
      resource.used[0] = true;
    } else {
      resource.used[0] = false;
    }
    this.charService.updateInspiration(this.characterData.id, resource.used[0]).then(() => {
      this.notification.openSnackBar('Ispirazione aggiornata.', 'check', 1000, 'limegreen');
    });
  }

  public reduceResource(risorsaIndex: number): void {
    const resource = this.risorseAggiuntiveData[risorsaIndex];
    if (resource.valoreAttuale > 0) {
      resource.valoreAttuale--;
      this.charService.updateAdditionalResources(this.characterData.id, this.risorseAggiuntiveData).then(() => {
        this.notification.openSnackBar('Risorsa aggiornata.', 'check', 1000, 'limegreen');
      });
    }
  }

  public increaseResource(risorsaIndex: number): void {
    const resource = this.risorseAggiuntiveData[risorsaIndex];
    if (resource.valoreAttuale < resource.valoreMassimo) {
      resource.valoreAttuale++;
      this.charService.updateAdditionalResources(this.characterData.id, this.risorseAggiuntiveData).then(() => {
        this.notification.openSnackBar('Risorsa aggiornata.', 'check', 1000, 'limegreen');
      });
    }
  }

  public getResourceQuantity(risorsaIndex: number): string {
    const resource = this.risorseAggiuntiveData[risorsaIndex];
    const result = resource.used.filter((value: boolean) => value === false).length;
    return result.toString();

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

  public newAdditionalResource(): void {
    this.matDialog.open(AddResourceDialogComponent, {
      width: innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: {
        charId: this.characterData.id
      }
    })
  }
}
