import { Platform } from '@angular/cdk/platform';
import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';

@Component({
  selector: 'app-item-info-sheet',
  templateUrl: './item-info-sheet.component.html',
  styleUrl: './item-info-sheet.component.scss',
})
export class ItemInfoSheetComponent {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { item: Item }, private sheetRef: MatBottomSheetRef<ItemInfoSheetComponent>, private dialog: MatDialog, private platform: Platform) {}

  openEditDialog(item: Item) {
    this.dialog.open(AddItemDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '90%' : '60%',
      disableClose: true,
      data: { inventory: [], item: item }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'edited') {
        this.sheetRef.dismiss({ status: 'edited', item: result.item });
      }
      if (result.status === 'deleted') {
        this.sheetRef.dismiss({ status: 'deleted', item: result.item });       
      }
    })
  }
}
