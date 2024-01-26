import { Component, Input } from '@angular/core';
import { DddiceService } from 'src/app/services/dddice.service';
import { RollDiceService } from 'src/app/services/roll-dice.service';

@Component({
  selector: 'app-abilita-tab-view',
  templateUrl: './abilita-tab-view.component.html',
  styleUrls: ['./abilita-tab-view.component.scss']
})
export class AbilitaTabViewComponent {

  constructor(
    private rollService: RollDiceService, 
    public diceService: DddiceService
  ){}

  public abilitaData: any[] = [];
  public maestrieData: any[] = [];
  public competenzeData: any = {};
  public bonusCompetenzaData: number = 0;
  public caratteristicheData: any = {};

  @Input() set abilita(abilita: any) {
    this.initMaestrieArray(abilita.abilita);

    this.bonusCompetenzaData = abilita.bonusCompetenza;
    this.caratteristicheData = abilita.caratteristiche;

    this.initMod(this.abilitaData, this.maestrieData, this.bonusCompetenzaData);

    this.abilitaData.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }

      return 0;
    });
  }

  @Input() set linguaggiCompetenze(linguaggiCompetenze: any) {
    this.competenzeData = linguaggiCompetenze;
  }

  private initMaestrieArray(abilita: any) {
    Object.keys(abilita).forEach((key) => {
      if (key.includes('maestria')) {
        this.maestrieData.push({ name: key.slice(8, 30), value: abilita[key] });
      } else {
        this.abilitaData.push({ name: key, value: abilita[key] });
      }
    });

    this.maestrieData.forEach((maestria) => {
      if (maestria.value) {
        this.abilitaData.find((abilita) => {
          if (abilita.name.toLowerCase() === maestria.name.toLowerCase()) {
            abilita.maestria = true;
          } else {
            abilita.maestria = false;
          }
        });
      }
    });
  }

  private initMod(abilita: any[], maestrie: any[], bonusCompetenza: number) {
    this.abilitaData.forEach((abilita) => {

      abilita.mod = abilita.value ? bonusCompetenza : 0;
      abilita.caratteristica = '';

      switch (abilita.name) {
        case 'acrobazia': case 'furtivita': case 'rapiditaDiMano':
          abilita.caratteristica = 'destrezza';
          abilita.short = 'Des';
          abilita.mod += Math.floor((this.caratteristicheData.destrezza - 10) / 2);
          break;

        case 'addestrareAnimali': case 'intuizione': case 'medicina': case 'percezione': case 'sopravvivenza':
          abilita.caratteristica = 'saggezza';
          abilita.short = 'Sag';
          abilita.mod += Math.floor((this.caratteristicheData.saggezza - 10) / 2);
          break;

        case 'arcano': case 'storia': case 'indagare': case 'natura': case 'religione':
          abilita.caratteristica = 'intelligenza';
          abilita.short = 'Int';
          abilita.mod += Math.floor((this.caratteristicheData.intelligenza - 10) / 2);
          break;

        case 'inganno': case 'intimidire': case 'intrattenere': case 'persuasione':
          abilita.caratteristica = 'carisma';
          abilita.short = 'Car';
          abilita.mod += Math.floor((this.caratteristicheData.carisma - 10) / 2);
          break;

        case 'atletica':
          abilita.caratteristica = 'forza';
          abilita.short = 'For';
          abilita.mod += Math.floor((this.caratteristicheData.forza - 10) / 2);
          break;
      }

      switch (abilita.name) {
        case 'rapiditaDiMano':
          abilita.name = 'rapidità di mano';
          break;

        case 'addestrareAnimali':
          abilita.name = 'addestrare animali';
          break;
      }

      abilita.maestria ? abilita.mod += bonusCompetenza : +0;
      abilita.mod > 0 ? abilita.mod = '+' + abilita.mod : abilita.mod = abilita.mod + '';
    });
  }

  public rollDice(name: string, modifier?: string): void {
    const message = "Prova di " + name;
    this.rollService.rollFromCharView('d20', message, Number(modifier));
  }
}
