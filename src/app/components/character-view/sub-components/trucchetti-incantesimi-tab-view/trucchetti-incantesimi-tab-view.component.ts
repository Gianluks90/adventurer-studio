import { Component, Input } from '@angular/core';
import { AddSpellDialogComponent } from './add-spell-dialog/add-spell-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CharacterService } from 'src/app/services/character.service';
import { MatDialog } from '@angular/material/dialog';
import { Spell } from 'src/app/models/spell';
import { NotificationService } from 'src/app/services/notification.service';

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
    // this.lista = data.lista;
    // this.sortSpells();
    // this.classeIncantatore = data.classeIncantatore;
    // this.caratteristicaIncantatore = data.caratteristicaIncantatore;
    // this.bonusAttaccoIncantesimi = data.bonusAttaccoIncantesimi;
    // this.CDTiroSalvezza = data.CD;
    // this.slotIncantesimi = data.slotIncantesimi;
  }

  public charData: any;
  @Input() set character(character: any) {
    if (!character) return;
    this.charData = character;
    this.lista = character.magia.trucchettiIncantesimi;
    this.sortSpells();
    this.classeIncantatore = character.magia.classeIncantatore;
    this.caratteristicaIncantatore = character.magia.caratteristicaIncantatore;

    this.bonusAttaccoIncantesimi = character.tiriSalvezza.bonusCompetenza + Math.floor((character.caratteristiche[character.magia.caratteristicaIncantatore.toLowerCase()] -10) / 2);
    this.CDTiroSalvezza = 8 + character.tiriSalvezza.bonusCompetenza + Math.floor((character.caratteristiche[character.magia.caratteristicaIncantatore.toLowerCase()] -10) / 2);
    this.slotIncantesimi = character.magia.slotIncantesimi;
    
    // this.lista = character.
  }

  constructor(private platform: Platform, private characterService: CharacterService, private dialog: MatDialog, private notification: NotificationService) { }

  useSlot(levelIndex: number, index: number): void {
    const spellLevel = this.slotIncantesimi[levelIndex];
    let message = '';

    // Se lo slot cliccato è falso, porta a true l'elemento più verso il fondo che è false
    if (!spellLevel.used[index]) {
      const lastFalseIndex = spellLevel.used.lastIndexOf(false);
      if (lastFalseIndex !== -1) {
        spellLevel.used[lastFalseIndex] = true;
        message = 'Slot incantesimo utilizzato.';
      }
    } else {
      // Se lo slot cliccato è true, porta a false l'elemento più in alto che è true
      const firstTrueIndex = spellLevel.used.indexOf(true);
      if (firstTrueIndex !== -1) {
        spellLevel.used[firstTrueIndex] = false;
        message = 'Slot incantesimo ripristinato.';
      }
    }
    this.characterService.updateSlotIncantesimi(window.location.href.split('/').pop(), this.slotIncantesimi).then(() => {
      this.notification.openSnackBar(message, 'check', 1000, "limegreen");
    });

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

  openAddSpellDialog(spell?: Spell, index?: number) {
    this.dialog.open(AddSpellDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { spells: this.lista, spell: spell }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.characterService.addSpell(window.location.href.split('/').pop(), result.spell).then(() => {
            this.lista.push(result.spell);
            this.sortSpells();
          });
          break;
        case 'edited':
          this.lista[index] = result.spell;
          this.characterService.updateSpells(window.location.href.split('/').pop(), this.lista);
          break;
        case 'deleted':
          this.lista.splice(index, 1);
          this.characterService.updateSpells(window.location.href.split('/').pop(), this.lista);
          break;
      }

      // if (result.status === 'success') {
      //   this.characterService.addSpell(window.location.href.split('/').pop(), result.spell).then(() => {
      //     this.lista.push(result.spell);
      //     this.sortSpells();
      //   });
      // } else if (result.status === 'edited') {
      //   this.lista[index] = result.spell;
      //   this.characterService.updateSpells(window.location.href.split('/').pop(), this.lista);
      // } else if (result.status === 'deleted') {
      //   this.lista.splice(index, 1);
      //   this.characterService.updateSpells(window.location.href.split('/').pop(), this.lista);
      // }
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

  sortSpellsBy(sortString: string, order: string) {
    this.lista.sort((a, b) => {
      if (a[sortString] < b[sortString]) {
        return order === 'crescente' ? -1 : 1;
      } else {
        return order === 'crescente' ? 1 : -1;
      }
    });
  }

  public showLevel(level: number): string {
    switch (level) {
      case 0:
        return 'T';
      case 1:
        return 'I';
      case 2:
        return 'II';
      case 3:
        return 'III';
      case 4:
        return 'IV';
      case 5:
        return 'V';
      case 6:
        return 'VI';
      case 7:
        return 'VII';
      case 8:
        return 'VIII';
      case 9:
        return 'IX';
      default:
        return '';
    }
  }

  public checkPreparedSpell(): number {
    const preparedSpells = this.lista.filter((spell) => spell.preparato && spell.livello > 0);
    return preparedSpells.length;
  }

  public prepareToggle(spell: Spell): void {
    spell.preparato = !spell.preparato;
    this.characterService.updateSpells(window.location.href.split('/').pop(), this.lista);
  }

}
