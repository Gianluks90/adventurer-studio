import { Component, Input } from '@angular/core';
import { AddSpellDialogComponent } from './add-spell-dialog/add-spell-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CharacterService } from 'src/app/services/character.service';
import { MatDialog } from '@angular/material/dialog';
import { Spell } from 'src/app/models/spell';

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
    this.sortSpells();
    console.log('lista',this.lista);
    this.classeIncantatore = data.classeIncantatore;
    this.caratteristicaIncantatore = data.caratteristicaIncantatore;
    this.bonusAttaccoIncantesimi = data.bonusAttaccoIncantesimi;
    this.CDTiroSalvezza = data.CD;
    this.slotIncantesimi = data.slotIncantesimi;
  }

  constructor(private platform: Platform, private characterService: CharacterService, private dialog: MatDialog) { }

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

  filterSearch(event: any) {
    const filter = event.target.value.toLowerCase().trim();
    this.lista = this.lista.map((item) => {
      return {
        ...item, filtered: !item.nome.toLowerCase().includes(filter)
      }
    })
  }

  openAddSpellDialog(spell?: Spell) {
    this.dialog.open(AddSpellDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '90%' : '60%',
      disableClose: true,
      data: { spells: this.lista, spell: spell }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        // this.characterService.addItemInventory(window.location.href.split('/').pop(), result.spell).then(() => {
        //   this.lista.push(result.spell);
        //   this.sortSpells();
        // });
      }
    })
  }

  private sortSpells() {
    this.lista.sort((a, b) => {
      if (a.nome < b.nome) {
        return -1;
      } else {
        return 1;
      }
    });
  }


}
