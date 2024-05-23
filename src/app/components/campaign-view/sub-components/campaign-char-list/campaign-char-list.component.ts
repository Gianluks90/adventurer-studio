import { Component, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CharacterBottomSheetComponent } from '../character-bottom-sheet/character-bottom-sheet.component';
import { Router } from '@angular/router';
import { CharacterService } from 'src/app/services/character.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { getAuth } from 'firebase/auth';
import { DescriptionTooltipService } from 'src/app/components/utilities/description-tooltip/description-tooltip.service';

@Component({
  selector: 'app-campaign-char-list',
  templateUrl: './campaign-char-list.component.html',
  styleUrl: './campaign-char-list.component.scss'
})
export class CampaignCharListComponent {

  // public charIdsData: string[] = [];
  public charData: any[] = [];
  public playersNumber: number = 0;
  public isMobile: boolean = false;
  public partecipantId: string = '';
  public denaroParty: any = {
    rame: 0,
    argento: 0,
    electrum: 0,
    oro: 0,
    platino: 0
  }
  public ispirazioneParty: number = 0;
  public detailsOpen: boolean = false;
  public totalCA: number = 0;

  @Input() set characters(characters: any) {
    if (characters.length === 0) return;
    this.partecipantId = getAuth().currentUser?.uid;
    this.charData = characters;
    this.playersNumber = characters.playersNumber;
    this.userFirst();
    this.calcPassiveSkills();
    this.calcCA();
    this.calcMoney();
    this.calcInspiration();
  }

  public isOwnerData: boolean = false;
  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  constructor(private breakpointObserver: BreakpointObserver, public tooltip: DescriptionTooltipService, private charService: CharacterService) {
    this.breakpointObserver.observe('(max-width: 600px)').subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit() {
    const storedState = localStorage.getItem('detailsOpen');
    this.detailsOpen = storedState === 'true';
  }

  detailsToggle(detailElement: HTMLDetailsElement) {
    this.detailsOpen = detailElement.open;
    localStorage.setItem('detailsOpen', this.detailsOpen.toString());
  }

  public navigateToChar(charId: string): void {
    window.open(`https://adventurer-studio.web.app/#/view/${charId}`, '_blank');
  }

  private calcPassiveSkills(): void {
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

  private calcCA(): void {
    this.charData.forEach(char => {
      char.CA = 10 + Math.floor((char.caratteristiche.destrezza - 10) / 2);
      char.equipaggiamento.forEach(item => {
        if (item.category.includes('Armatura') && item.weared) {
          char.CA = item.CA + (item.plusDexterity ? Math.floor((char.caratteristiche.destrezza - 10) / 2) : 0);
        }
        if (item.category.includes('scudo') && item.weared) {
          char.shieldCA = '+' + item.CA;
        }
      })
    });
  }

  public calcTotalCA(CA: string, shieldCA?: string): string {
    const bonusCA = shieldCA ? parseInt(shieldCA.replace('+', '')) : 0;
    return (parseInt(CA) + bonusCA).toString();
  }

  public calcMoney(): void {
    this.denaroParty = {
      rame: 0,
      argento: 0,
      electrum: 0,
      oro: 0,
      platino: 0
    }

    this.charData.forEach(char => {
      this.denaroParty.rame += char.denaro.MR;
      this.denaroParty.argento += char.denaro.MA;
      this.denaroParty.electrum += char.denaro.ME;
      this.denaroParty.oro += char.denaro.MO;
      this.denaroParty.platino += char.denaro.MP;
    });
  }

  public calcInspiration(): void {
    this.ispirazioneParty = this.charData.reduce((acc, char) => acc + (!char.ispirazione ? 1 : 0), 0);
  }

  public userFirst(): void {
    const index = this.charData.findIndex(item => item.status.userId === this.partecipantId);
    if (index !== -1) {
      const elemento = this.charData.splice(index, 1)[0];
      this.charData.unshift(elemento);
    }
  }

  public calcModifier(value: number): string {
    return Math.floor((value - 10) / 2) >= 0 ? '+' + Math.floor((value - 10) / 2) : Math.floor((value - 10) / 2).toString();
  }

  public ispirazioneToggle(char: any) {
    this.charService.updateInspiration(char.id, !char.ispirazione);
  }
}

// public usaIspirazione(): void {
//   const resource = this.ispirazione;
//   if (!resource.used[0]) {
//     resource.used[0] = true;
//   } else {
//     resource.used[0] = false;
//   }
//   this.charService.updateInspiration(this.characterData.id, resource.used[0]).then(() => {
//     this.notification.openSnackBar('Ispirazione aggiornata.', 'check', 1000, 'limegreen');
//   });
// }