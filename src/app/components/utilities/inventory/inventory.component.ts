import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from 'src/app/models/item';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {

  public inventoryData: Item[] = [];
  @Input() set inventory(inventory: Item[]) {
    this.inventoryData = inventory;
  }

  constructor(private dialog: MatDialog, private platform: Platform) {
    
  }

  ngOnInit() {
    this.inventoryData = [
      {
        name: 'pippo',
        icon: '',
        filtered: false,
      },
      {
        name: 'bruco',
        icon: '',
        filtered: false,
      }
    ];
  }

  openAddItemDialog(){
    this.dialog.open(AddItemDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS)? '80%' : '50%',
      disableClose: true,
      data: { inventory: this.inventoryData}
    }).afterClosed().subscribe((result: any) => {
      console.log('result', result);
      if (result.status === 'success') {
        this.inventoryData.push(result.item);
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
