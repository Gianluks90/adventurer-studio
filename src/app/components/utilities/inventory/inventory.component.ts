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
    if (!selectedChar) return;
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
          this.characterService.addItemInventory(window.location.href.split('/').pop(), result.item);
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
        const itemExists = this.selectedCharData.inventory.find((item) => item.name === result.item.name);
        if (itemExists) {
          this.selectedCharData.inventory.find((item) => item.name === result.item.name).quantity += result.quantity;
          this.characterService.updateInventory(this.selectedCharData.id, this.selectedCharData.inventory).then(() => {
            this.inventoryData[index].quantity -= result.quantity;
            this.inventoryData[index].visible = this.inventoryData[index].quantity > 0;
            this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
          });
        } else {
          const resultItem = { ...result.item };
          resultItem.quantity = result.quantity;
          this.characterService.addItemInventory(this.selectedCharData.id, resultItem).then(() => {
            this.inventoryData[index].quantity -= result.quantity;
            this.inventoryData[index].visible = this.inventoryData[index].quantity > 0;
            this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
          });
        }
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

  public currentTooltipItem: any;
  public showItemTooltip: boolean = false;
  public tooltipPosition: { top: number | string, left: number | string } = { top: 0, left: 0 };

  public showTooltip(event: MouseEvent, item: any) {
    this.currentTooltipItem = item;
    this.showItemTooltip = true;
    setTimeout(() => {
      const tooltip = document.getElementById('item-tooltip') as HTMLElement;
      if (!tooltip) return;
      const rect = tooltip.getBoundingClientRect();
      if (event.clientY + rect.height > window.innerHeight) {
        // this.tooltipPosition.top = window.innerHeight - rect.height - 10;
        this.tooltipPosition = { top: window.innerHeight+50 - rect.height, left: event.clientX - 175 };
      } else {
        this.tooltipPosition = { top: event.clientY, left: event.clientX - 175 };
      }
    }, 100);
    // this.tooltipPosition = { top: event.clientY, left: event.clientX-175};
  }

  public hideTooltip() {
    this.showItemTooltip = false;
  }

  public getDamagesString(item: Item, formula: string): string {
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

    if (minimo === massimo) return `${minimo} danno/i (${item.damageType})`;
    return `${minimo}-${massimo}` + ' danni (' + item.damageType + ')'; 
  }

  public getPropsString(item: Item): string {
    const result: string[] = [];
    if (item.weaponProperties) {
      const weaponProperties: string[] = item.weaponProperties.map((prop) => {
        if (prop.name === 'lancio' || prop.name === 'gittata') return (prop.name[0].toUpperCase() + prop.name.slice(1)) + ' (' + item.range + ')';
        if (prop.name === 'versatile') return (prop.name[0].toUpperCase() + prop.name.slice(1)) + ' (' + item.versatileDice + ')';
        return prop.name[0].toUpperCase() + prop.name.slice(1);
      });
      result.push(...weaponProperties);
    }
    if (item.traits) {
      const magicTraits: string[] = item.traits.map((trait) => {
        return trait.title[0].toUpperCase() + trait.title.slice(1);
      });
      result.push(...magicTraits);
    }
    if (item.artifactProperties) {
      const artifactProperties: string[] = item.artifactProperties.map((prop) => {
        return prop.title[0].toUpperCase() + prop.title.slice(1);
      });
      result.push(...artifactProperties);
    }
    return result.join(', ');
    // return [...weaponProperties, ...magicTraits, ...artifactProperties].join(', ');
  }
}
