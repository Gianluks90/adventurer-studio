import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-abilita-tab-view',
  templateUrl: './abilita-tab-view.component.html',
  styleUrls: ['./abilita-tab-view.component.scss']
})
export class AbilitaTabViewComponent {

  public abilitaData: any[] = [];
  public maestrieData: any[] = [];

  public bonusCompetenzaData: number = 0;
  public caratteristicheData: any = {};

  @Input() set abilita(abilita: any) {
    Object.keys(abilita).forEach((key) => {
      if (key.includes('maestria')) {
        this.maestrieData.push({ name: key.slice(8, 30) });
      } else {
        this.abilitaData.push({ name: key, value: abilita[key] });
      }
    });

    this.maestrieData.forEach((maestria) => {
      this.abilitaData.find((abilita) => {
        if (abilita.name === maestria.name.toLowerCase()) {
          abilita.maestria = true;
        } else {
          abilita.maestria = false;
        }
      });
    });

    this.abilitaData.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }

      return 0;
    });
  }

  @Input() set bonusCompetenza(bonusCompetenzaData: number) {
    this.bonusCompetenzaData = bonusCompetenzaData;
    if (this.abilitaData.length > 0) {
      this.abilitaData.forEach((abilita) => {
        abilita.mod = abilita.value ? bonusCompetenzaData : 0;
        abilita.caratteristica = '';

        switch (abilita.name) {
          case 'acrobazia': case 'furtivita': case 'rapiditaDiMano':
            abilita.caratteristica = 'destrezza';
            abilita.short = 'Des';
            break;

          case 'addestrareAnimali': case 'intuizione': case 'medicina': case 'percezione': case 'sopravvivenza':
            abilita.caratteristica = 'saggezza';
            abilita.short = 'Sag';
            break;

          case 'arcano': case 'storia': case 'indagare': case 'natura': case 'religione':
            abilita.caratteristica = 'intelligenza';
            abilita.short = 'Int';
            break;

          case 'inganno': case 'intimidire': case 'intrattenere': case 'persuasione':
            abilita.caratteristica = 'carisma';
            abilita.short = 'Car';
            break;

          case 'atletica':
            abilita.caratteristica = 'forza';
            abilita.short = 'For';
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
      });
    }
  }

  @Input() set caratteristiche(caratteristiche: any) {
    this.caratteristicheData = caratteristiche;
    if (this.abilitaData.length > 0) {
      this.abilitaData.forEach((abilita) => {
        abilita.mod += Math.floor((caratteristiche[abilita.caratteristica] - 10) / 2);
        // if (abilita.maestria) {
        //   abilita.mod += this.bonusCompetenzaData;
        // }
        abilita.mod > 0 ? abilita.mod = '+ ' + abilita.mod : abilita.mod = abilita.mod + '';
      });
    }
  }
}
