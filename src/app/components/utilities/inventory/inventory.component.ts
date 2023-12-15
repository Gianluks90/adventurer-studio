import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/item';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {

  public inventoryData: Item[] = [];
  @Input() set inventory(inventory: Item[]) {
    this.inventoryData = inventory;
    console.log('inventoryData input', this.inventoryData);
  }

  constructor(private dialog: MatDialog, private platform: Platform, private characterService: CharacterService) {
    
  }

  openAddItemDialog(){
    this.dialog.open(AddItemDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS)? '90%' : '60%',
      disableClose: true,
      data: { inventory: this.inventoryData}
    }).afterClosed().subscribe((result: any) => {
      console.log('result', result);
      if (result.status === 'success') {
        this.characterService.updateInventory(window.location.href.split('/').pop(), result.item).then(()=> {
          this.inventoryData.push(result.item);
          console.log('inventory aggiornato', this.inventoryData);
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

}
