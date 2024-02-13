import { Component, Input } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CharacterBottomSheetComponent } from '../character-bottom-sheet/character-bottom-sheet.component';
import { Router } from '@angular/router';

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

  constructor(private bottomSheet: MatBottomSheet, private router: Router) { }

  public openCharBottomSheet(charId: string): void {
    this.bottomSheet.open(CharacterBottomSheetComponent, {
      autoFocus: false,
      disableClose: true,
      data: { id: charId }
    })
  }

  public navigateToChar(charId: string): void {
    window.open(`https://adventurer-studio.web.app/#/view/${charId}`, '_blank');
  }
}
