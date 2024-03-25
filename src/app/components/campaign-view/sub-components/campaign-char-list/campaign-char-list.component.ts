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
    this.calcPassiveSkills();
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

  public calcPassiveSkills(): void {
    console.log('calcPassiveSkills', this.charData);

    this.charData.forEach(char => {
      const intelligenza = Math.floor((char.caratteristiche.intelligenza - 10) / 2);
      const saggezza = Math.floor((char.caratteristiche.saggezza - 10) / 2);

      char.percezionePassiva = 10 + saggezza + (char.competenzaAbilita.percezione ? char.tiriSalvezza.bonusCompetenza : 0);
      char.intuizionePassiva = 10 + saggezza + (char.competenzaAbilita.intuizione ? char.tiriSalvezza.bonusCompetenza : 0);
      char.indagarePassiva = 10 + intelligenza + (char.competenzaAbilita.indagare ? char.tiriSalvezza.bonusCompetenza : 0);

      char.percezionePassiva += char.competenzaAbilita.maestriaPercezione ? char.tiriSalvezza.bonusCompetenza : 0;
      char.intuizionePassiva += char.competenzaAbilita.maestriaIntuizione ? char.tiriSalvezza.bonusCompetenza : 0;
      char.indagarePassiva += char.competenzaAbilita.maestriaIndagare ? char.tiriSalvezza.bonusCompetenza : 0;
    });
  }

  // public initProvePassive(): void {
  //   const intelligenza = Math.floor((this.characterData.caratteristiche.intelligenza - 10) / 2);
  //   const saggezza = Math.floor((this.characterData.caratteristiche.saggezza - 10) / 2);

  //   this.indagarePassiva = 10 + intelligenza + (this.characterData.competenzaAbilita.indagare ? this.characterData.tiriSalvezza.bonusCompetenza : 0);
  //   this.percezionePassiva = 10 + saggezza + (this.characterData.competenzaAbilita.percezione ? this.characterData.tiriSalvezza.bonusCompetenza : 0);
  //   this.intuizionePassiva = 10 + saggezza + (this.characterData.competenzaAbilita.intuizione ? this.characterData.tiriSalvezza.bonusCompetenza : 0);

  //   this.indagarePassiva += this.characterData.competenzaAbilita.maestriaIndagare ? this.characterData.tiriSalvezza.bonusCompetenza : 0;
  //   this.percezionePassiva += this.characterData.competenzaAbilita.maestriaPercezione ? this.characterData.tiriSalvezza.bonusCompetenza : 0;
  //   this.intuizionePassiva += this.characterData.competenzaAbilita.maestriaIntuizione ? this.characterData.tiriSalvezza.bonusCompetenza : 0;
  // }

  public sortCharByABC(): void {
    this.charData.sort((a, b) => a.informazioniBase.nomePersonaggio.localeCompare(b.informazioniBase.nomePersonaggio));
  }
}
