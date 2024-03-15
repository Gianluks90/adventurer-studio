import { Component, Input, effect } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CharacterBottomSheetComponent } from '../character-bottom-sheet/character-bottom-sheet.component';
import { Router } from '@angular/router';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-campaign-char-list',
  templateUrl: './campaign-char-list.component.html',
  styleUrl: './campaign-char-list.component.scss'
})
export class CampaignCharListComponent {

  // public charIdsData: string[] = [];
  public charData: any[] = [];

  @Input() set characters(characters: any[]) {
    this.charData = characters;
    this.sortCharByABC();
  }

  constructor(private bottomSheet: MatBottomSheet, private router: Router, private charService: CharacterService) {
    // effect(() => {
    //   this.charData = this.charService.campaignCharacters().filter((char: any) => this.charIdsData.includes(char.id));
    // });
   }

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

  public sortCharByABC(): void {
    this.charData.sort((a, b) => a.informazioniBase.nomePersonaggio.localeCompare(b.informazioniBase.nomePersonaggio));
  }
}
