import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/item';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CharacterService } from 'src/app/services/character.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ItemInfoSheetComponent } from './item-info-sheet/item-info-sheet.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {

  public inventoryData: Item[] = [];
  @Input() set inventory(inventory: Item[]) {
    this.inventoryData = inventory;
    this.sortInventory();
  }

  constructor(private dialog: MatDialog, private bottomSheet: MatBottomSheet, private platform: Platform, private characterService: CharacterService) {}

  openAddItemDialog() {
    this.dialog.open(AddItemDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { inventory: this.inventoryData }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        this.characterService.addItemInventory(window.location.href.split('/').pop(), result.item).then(() => {
          this.inventoryData.push(result.item);
          this.sortInventory();
        });
      }
    })
  }

  filterSearch(event: any) {
    const filter = event.target.value.toLowerCase().trim();
    this.inventoryData = this.inventoryData.map((item) => {
      return {
        ...item, filtered: !item.name.toLowerCase().includes(filter)
      }
    })
  }

  public openInfoSheet(item: Item, index: number) {
    this.bottomSheet.open(ItemInfoSheetComponent, {
      // disableClose: true,
      panelClass: 'item-info-sheet',
      autoFocus: false,
      data: { item }
    }).afterDismissed().subscribe((result: any) => {
      if (result && result.status === 'edited') {
        this.inventoryData[index] = result.item;
        this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      }
      if (result && result.status === 'deleted') {
        this.inventoryData.splice(index, 1);
        this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      }
    });
  }

  setColor(rarity: string): string {
    switch (rarity) {
      case 'comune':
        return '#FFF'
        break;
      case 'non_comune':
        return '#B2B4D1'
        break;
      case 'raro':
        return '#0313FC'
        break;
      case 'molto_raro':
        return '#8403FC'
        break;
      case 'leggendario':
        return '#FFAA00'
        break;
      case 'unico':
        return '#A6926A'
        break;
      default:
        return '#FFF'
        break;
    }
  }

  private sortInventory() {
    this.inventoryData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

}
