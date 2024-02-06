import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAttackDialogComponent } from './add-attack-dialog/add-attack-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { Attack } from 'src/app/models/attack';
import { CharacterService } from 'src/app/services/character.service';
import { RollDiceService } from 'src/app/services/roll-dice.service';
import { DddiceService } from 'src/app/services/dddice.service';

@Component({
  selector: 'app-attacchi-tab-view',
  templateUrl: './attacchi-tab-view.component.html',
  styleUrl: './attacchi-tab-view.component.scss'
})
export class AttacchiTabViewComponent {

  public attacchiData: Attack[];

  @Input() set attacchi(attacchi: any[]) {
    this.attacchiData = attacchi;
    this.sortAttacks();
  }

  constructor(
    private dialog: MatDialog,
    private platform: Platform,
    private charService: CharacterService,
    private rollService: RollDiceService,
    public diceService: DddiceService) { }

  public filterSearch(event: any) {
    const filter = event.target.value.toLowerCase().trim();
    this.attacchiData = this.attacchiData.map((item) => {
      return {
        ...item, filtered: !item.name.toLowerCase().includes(filter)
      }
    });
  }

  public openAddAttackDialog(attack?: Attack, insex?: number): void {
    this.dialog.open(AddAttackDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { attacks: this.attacchiData, attack: attack }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.charService.addAttack(window.location.href.split('/').pop(), result.attack).then(() => {
            this.attacchiData.push(result.attack);
            this.sortAttacks();
          });
          break;
        case 'edited':
          this.attacchiData[insex] = result.attack;
          this.charService.updateAttacks(window.location.href.split('/').pop(), this.attacchiData); break;
        case 'deleted':
          this.attacchiData.splice(insex, 1);
          this.charService.updateAttacks(window.location.href.split('/').pop(), this.attacchiData);
          break;
      }
    });
  }

  private sortAttacks() {
    this.attacchiData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  public attackRoll(attack: Attack) {
    this.rollService.rollFromCharView('d20', 'Tiro per colpire', attack.attackBonus);
  }

  public damageRoll(attack: Attack) {
    this.rollService.rollDamage(attack.damage);
  }
}
