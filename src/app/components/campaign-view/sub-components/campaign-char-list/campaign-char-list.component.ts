import { Component, Input } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-campaign-char-list',
  templateUrl: './campaign-char-list.component.html',
  styleUrl: './campaign-char-list.component.scss'
})
export class CampaignCharListComponent {

  public charData: any[] = [];

  @Input() set characters(characters: any[]) {
    this.charData = characters;
  }

  constructor(private bottomSheet: MatBottomSheet) { }

  public openCharBottomSheet(charId: string): void {
    // this.bottomSheet.open(CharacterBottomSheetComponent, {
    //   autoFocus: false,
    //   disableClose: true,
    //   data: { id: charId }
    // })
  }
}
