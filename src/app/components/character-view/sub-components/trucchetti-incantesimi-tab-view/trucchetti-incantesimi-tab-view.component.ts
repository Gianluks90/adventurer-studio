import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trucchetti-incantesimi-tab-view',
  templateUrl: './trucchetti-incantesimi-tab-view.component.html',
  styleUrls: ['./trucchetti-incantesimi-tab-view.component.scss']
})
export class TrucchettiIncantesimiTabViewComponent {

  public lista: any[];
  public classeIncantatore: string;
  public caratteristicaIncantatore: string;
  public bonusAttaccoIncantesimi: number;
  public CDTiroSalvezza: number;

  @Input() set trucchettiIncantesimi(abilita: any) {
    this.lista = abilita.lista;
    this.classeIncantatore = abilita.classeIncantatore;
    this.caratteristicaIncantatore = abilita.caratteristicaIncantatore;
    this.bonusAttaccoIncantesimi = abilita.bonusAttaccoIncantesimi;
    this.CDTiroSalvezza = abilita.CD;

    console.log(this.lista);
  }
}
