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
  public slotIncantesimi: any;

  @Input() set trucchettiIncantesimi(data: any) {
    this.lista = data.lista;
    this.classeIncantatore = data.classeIncantatore;
    this.caratteristicaIncantatore = data.caratteristicaIncantatore;
    this.bonusAttaccoIncantesimi = data.bonusAttaccoIncantesimi;
    this.CDTiroSalvezza = data.CD;
    this.slotIncantesimi = data.slotIncantesimi;
  }

  // useSlot(levelIndex: number, slotIndex: number) {
  //   if (this.slotIncantesimi[levelIndex].used[slotIndex]) {
  //     this.slotIncantesimi[levelIndex].used[slotIndex] = false;
  //   } else {
  //     this.slotIncantesimi[levelIndex].used[slotIndex] = true;
  //   }
  // }

  useSlot(levelIndex: number, index: number): void {
    const spellLevel = this.slotIncantesimi[levelIndex];
  
    // Se lo slot cliccato è falso, porta a true l'elemento più verso il fondo che è false
    if (!spellLevel.used[index]) {
      const lastFalseIndex = spellLevel.used.lastIndexOf(false);
      if (lastFalseIndex !== -1) {
        spellLevel.used[lastFalseIndex] = true;
      }
    } else {
      // Se lo slot cliccato è true, porta a false l'elemento più in alto che è true
      const firstTrueIndex = spellLevel.used.indexOf(true);
      if (firstTrueIndex !== -1) {
        spellLevel.used[firstTrueIndex] = false;
      }
    }
  
    // Aggiorna il tuo HTML o fai altre azioni necessarie per riflettere il cambiamento
  }
}
