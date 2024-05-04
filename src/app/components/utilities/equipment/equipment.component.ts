import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Damage, Item } from 'src/app/models/item';
import { ManageEquipDialogComponent } from './manage-equip-dialog/manage-equip-dialog.component';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class EquipmentComponent {

  constructor(private matDialog: MatDialog, private charService: CharacterService) { }

  public charData: any;
  private inventoryData: Item[] = [];
  public setsData: any[] = [];
  public setIndex: number = 0;
  public wearedItems: Item[] = [];
  public CA: string = '';

  @Input() set character(character: any) {
    this.charData = character;
    // this.CA = (character.CA + character.CAShield).replace(' ', '');
    this.calculateCA();

    this.inventoryData = character.equipaggiamento;
    this.setsData = character.sets || [];
    this.checkWeared(this.inventoryData);
  }

  public editModeData: boolean = false;
  @Input() set editMode(editMode: boolean) {
    this.editModeData = editMode;
  }

  public showMoreInfo(event: Event): void {

  }

  public checkWeared(inventory: Item[]): void {
    this.wearedItems = inventory.filter(item => item.weared);
    this.wearedItems = this.wearedItems.sort((a, b) => a.name.localeCompare(b.name));
    this.calculateCA();
  }

  public changeSetOdl(): void {
    // Aumenta l'indice del set attuale
    this.setIndex = this.setIndex + 1 > this.setsData.length - 1 ? 0 : this.setIndex + 1;

    // Filtra gli oggetti del set precedente e rimuovili da wearedItems
    const previousSet = this.setsData[(this.setIndex === 0 ? this.setsData.length - 1 : this.setIndex - 1)];
    if (previousSet.mainHand) {
      this.wearedItems = this.wearedItems.filter(item => item.name !== previousSet.mainHand.name);
    }
    if (previousSet.offHand) {
      this.wearedItems = this.wearedItems.filter(item => item.name !== previousSet.offHand.name);
    }

    // Aggiungi gli oggetti del nuovo set a wearedItems
    const newSet = this.setsData[this.setIndex];
    if (newSet.mainHand) {
      this.wearedItems.push(newSet.mainHand);
    }
    if (newSet.offHand) {
      this.wearedItems.push(newSet.offHand);
    }

    // Aggiorna il flag "weared" negli oggetti dell'inventario
    this.inventoryData.forEach(item => {
      item.weared = this.wearedItems.includes(item);
    });

  }

  public changeSet(): void {
    // Aumenta l'indice del set attuale
    this.setIndex = this.setIndex + 1 > this.setsData.length - 1 ? 0 : this.setIndex + 1;

    // Filtra gli oggetti del set precedente e rimuovili da wearedItems
    const previousSet = this.setsData[(this.setIndex === 0 ? this.setsData.length - 1 : this.setIndex - 1)];
    if (previousSet.mainHand) {
      this.wearedItems = this.wearedItems.filter(item => item.name !== previousSet.mainHand.name);
    }
    if (previousSet.offHand) {
      this.wearedItems = this.wearedItems.filter(item => item.name !== previousSet.offHand.name);
    }

    // Aggiungi gli oggetti del nuovo set a wearedItems
    const newSet = this.setsData[this.setIndex];
    if (newSet.mainHand) {
      this.wearedItems.push(newSet.mainHand);
    }
    if (newSet.offHand) {
      this.wearedItems.push(newSet.offHand);
    }

    // Aggiorna il flag "weared" negli oggetti dell'inventario
    this.inventoryData.forEach(item => {
      item.weared = this.wearedItems.includes(item);
    });

    // Calcola la CA
    this.calculateCA();
  }

  private calculateCA(): void {
    // Trova gli oggetti indossati con CA > 0
    const equippedItems = this.wearedItems.filter(item => item.weared && item.CA > 0) || [];
    // Se non ci sono oggetti indossati con CA > 0
    if (equippedItems.length === 0) {
      // Calcola la CA basata sul modificatore di destrezza
      const dexModifier = Math.floor((this.charData.caratteristiche.destrezza - 10) / 2);
      this.CA = (10 + dexModifier).toString();
      return;
    }

    // Se ci sono oggetti indossati con CA > 0
    let baseCA = 10; // Valore base della CA
    let shieldBonus = ''; // Bonus aggiuntivo dalla presenza dello scudo

    equippedItems.forEach(item => {
      // Se l'oggetto è uno scudo, aggiungi il suo valore alla stringa shieldBonus
      if (item.shield) {
        shieldBonus += `+${item.CA}`;
      } else {
        // Altrimenti, se è un'armatura, aggiorna il valore base della CA
        if (item.plusDexterity) {
          const dexModifier = Math.floor((this.charData.caratteristiche.destrezza - 10) / 2);
          baseCA = item.CA + dexModifier;
        } else {
          baseCA = item.CA;
        }
        // baseCA = item.CA;
      }
    });

    // Costruisci la stringa per il bonus dello scudo solo se è diverso da zero
    // Costruisci la stringa per il bonus dello scudo solo se è diverso da zero
    const shieldBonusString = parseInt(shieldBonus) !== 0 ? `${shieldBonus}` : '';

    // Aggiorna la CA con la stringa composta dal valore base e dal bonus dello scudo
    this.CA = `${baseCA}${shieldBonusString !== '' ? shieldBonusString : ''}`;




  }


  public openManageDialog(): void {
    this.matDialog.open(ManageEquipDialogComponent, {
      width: window.innerWidth < 768 ? '90%%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { inventory: this.inventoryData, sets: this.setsData }
    }).afterClosed().subscribe((result: any) => {
      if (result && result.status === 'success') {
        this.wearedItems = result.weared;
        if (result.sets.length > 0) {
          this.wearedItems.push(result.sets[0].mainHand);
          this.wearedItems.push(result.sets[0].offHand);
        }
        this.charService.updateSets(this.charData.id, result.sets);
        this.inventoryData.map(item => {
          item.weared = this.wearedItems.includes(item);
        });
        this.charService.updateInventory(this.charData.id, this.inventoryData).then(() => {
          this.setIndex = 0;
        });
      }
    });
  }

  setColor(rarity: string): string {
    switch (rarity) {
      case 'Comune':
        return '#212121'
        break;
      case 'Non comune':
        return '#00ff01'
        break;
      case 'Raro':
        return '#6d9eeb'
        break;
      case 'Molto raro':
        return '#9a00ff'
        break;
      case 'Leggendario':
        return '#e29138'
        break;
      case 'Unico':
        return '#e06467'
        break;
      case 'Oggetto chiave':
        return '#DDD605'
        break;
      default:
        return '#212121'
        break;
    }
  }

  public getDamagesStringOld(formula: string): string {
    if (!formula || formula === '') return '';
    const termini = formula.replace(/\s/g, '').split('+');

    let minimo = 0;
    let massimo = 0;
    termini.forEach(termine => {
      if (termine.includes('d')) {
        const [numDadi, numFacce] = termine.split('d').map(Number);
        minimo += numDadi;
        massimo += numDadi * numFacce;
      } else {
        const costante = parseInt(termine);
        minimo += costante;
        massimo += costante;
      }
    });

    if (minimo === massimo) return `${minimo}`;
    return `${minimo}-${massimo}`;
  }

  public getDamagesString(formula, extraDamages?: Damage[]) {
    if (!formula) {
      return { minimo: 'error', massimo: 'error' };
    }
    // Rimuovi gli spazi bianchi e separa la formula in termini
    const termini = formula.replace(/\s/g, '').split('+');

    let minimo = 0;
    let massimo = 0;

    // Calcola il minimo e il massimo per ogni termine
    termini.forEach(termine => {
      if (termine.includes('d')) {
        // Se il termine contiene 'd', è un termine dei dadi
        const [numDadi, numFacce] = termine.split('d').map(Number);
        minimo += numDadi;
        massimo += numDadi * numFacce;
      } else {
        // Altrimenti, è un termine costante
        const costante = parseInt(termine);
        minimo += costante;
        massimo += costante;
      }
    });

    // Calcola il danno aggiuntivo, se presente
    if (extraDamages && extraDamages.length > 0) {
      extraDamages.forEach((extraDamage) => {
        let extraMin = 0;
        let extraMax = 0;
        const extraTermini = extraDamage.formula.replace(/\s/g, '').split('+');
        extraTermini.forEach(termine => {
          if (termine.includes('d')) {
            const [numDadi, numFacce] = termine.split('d').map(Number);
            extraMin += numDadi;
            extraMax += numDadi * numFacce;
          } else {
            const costante = parseInt(termine);
            extraMin += costante;
            extraMax += costante;
          }
        });
        minimo += extraMin;
        massimo += extraMax;
      });
    }

    if (minimo === massimo) return `${minimo}`;
    return `${minimo}-${massimo}`;
  }

  // TOOLTIP

  public currentTooltipItem: any;
  public showItemTooltip: boolean = false;
  public tooltipPosition: { top: number | string, left: number | string } = { top: 0, left: 0 };

  public showTooltip(event: MouseEvent, item: any) {
    if (window.innerWidth < 768) return;
    this.currentTooltipItem = item;
    this.showItemTooltip = true;
    setTimeout(() => {
      const tooltip = document.getElementById('item-tooltip-equip') as HTMLElement;
      if (!tooltip) return;
      const rect = tooltip.getBoundingClientRect();
      if (event.clientY + rect.height > window.innerHeight) {
        // this.tooltipPosition.top = window.innerHeight - rect.height - 10;
        this.tooltipPosition = { top: window.innerHeight + 50 - rect.height, left: event.clientX - 175 };
      } else {
        this.tooltipPosition = { top: event.clientY, left: event.clientX + 175 };
      }
    }, 100);
    // this.tooltipPosition = { top: event.clientY, left: event.clientX-175};
  }

  public hideTooltip() {
    this.showItemTooltip = false;
  }

}
