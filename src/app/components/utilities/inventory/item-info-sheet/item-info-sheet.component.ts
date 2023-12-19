import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-item-info-sheet',
  templateUrl: './item-info-sheet.component.html',
  styleUrl: './item-info-sheet.component.scss',
})
export class ItemInfoSheetComponent {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { item: Item }, private sheetRef: MatBottomSheetRef<ItemInfoSheetComponent>) {}

}
