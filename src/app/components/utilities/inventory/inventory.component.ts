import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/item';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CharacterService } from 'src/app/services/character.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ItemInfoSheetComponent } from './item-info-sheet/item-info-sheet.component';
import { CampaignService } from 'src/app/services/campaign.service';

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

  public isOwnerData: boolean = false;
  @Input() set isCampaignOwner(isCampaignOwner: boolean) {
    this.isOwnerData = isCampaignOwner;
  }

  public selectedCharData: any;
  @Input() set selectedChar(selectedChar: string) {
    this.selectedCharData = selectedChar;
  }

  public isCampaign: boolean = false;

  constructor(
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private characterService: CharacterService,
    private campaignService: CampaignService) {
    this.isCampaign = window.location.href.includes('campaign-view');
  }

  openAddItemDialog() {
    this.dialog.open(AddItemDialogComponent, {
      width: window.innerWidth < 500 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { inventory: this.inventoryData, isOwner: this.isOwnerData }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        if (!this.isCampaign) {
          this.characterService.addItemInventory(window.location.href.split('/').pop(), result.item).then(() => {
            this.inventoryData.push(result.item);
          });
        } else {
          this.campaignService.addItemInventory(window.location.href.split('/').pop(), result.item);
        }
        this.sortInventory();
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
      data: { item: item, isOwner: this.isOwnerData }
    }).afterDismissed().subscribe((result: any) => {
      if (result && result.status === 'edited') {
        this.inventoryData[index] = result.item;
        if (!this.isCampaign) {
          this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
        } else {
          this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
        }
      }
      if (result && result.status === 'deleted') {
        this.inventoryData.splice(index, 1);
        if (!this.isCampaign) {
          this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
        } else {
          this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
        }
      }
      if (result && result.status === 'reclamed' && this.selectedCharData) {
        const resultItem = { ...result.item };
        resultItem.quantity = result.quantity;
        this.characterService.addItemInventory(this.selectedCharData.id, resultItem).then(() => {
          this.inventoryData[index].quantity -= result.quantity;
          this.inventoryData[index].visible = this.inventoryData[index].quantity > 0;
          this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
        });
      }
      if (result && result.status === 'consumed') {
        this.inventoryData[index].quantity--;
        this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      }
      if (result && result.status === 'equipped') {
        // Se è uno scudo
        if (this.inventoryData[index].shield) {
          this.inventoryData.forEach((item) => {
            if (item.shield && item.name !== this.inventoryData[index].name) {
              item.weared = false;
            }
          });
        this.inventoryData[index].weared = !this.inventoryData[index].weared;
        }

        // Se è un'armatura
        if (this.inventoryData[index].category.includes('Armatura')) {
          this.inventoryData.forEach((item) => {
            if (item.name !== this.inventoryData[index].name && item.category.includes('Armatura')) {
              item.weared = false;
            }
          });
          this.inventoryData[index].weared = !this.inventoryData[index].weared;
        }

        this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
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
