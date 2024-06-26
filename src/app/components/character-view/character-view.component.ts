import { Component, Input, effect } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CharacterService } from 'src/app/services/character.service';
import { FormService } from 'src/app/services/form.service';
import { MenuService } from 'src/app/services/menu.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { DiceComponent } from '../utilities/dice/dice.component';
import { DddiceService } from 'src/app/services/dddice.service';
import { getAuth } from 'firebase/auth';
import { CampaignService } from 'src/app/services/campaign.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.scss']
})
export class CharacterViewComponent {

  public character: any;
  public competenzeAbilita: any;
  public linguaggiCompetenze: any;
  public trucchettiIncantesimi: any;
  public charId: string = '';
  public inCampaign: boolean = false;
  public editMode: boolean = false;

  // initize a breakpointObserver
  public isMobile: boolean = false;
  // public menuIcon = 'menu';

  constructor(
    // private menuService: MenuService,
    private characterService: CharacterService,
    private sidenavService: SidenavService,
    private formService: FormService,
    private diceSelector: MatBottomSheet,
    public diceService: DddiceService,
    private campaignService: CampaignService,
    breakpointObserver: BreakpointObserver) {
    if (window.location.href.includes('campaign-view/')) {
      this.inCampaign = true;
    }
    breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.isMobile = result.matches;
    });

    if (this.charId === '' && !window.location.href.includes('campaign-view')) {
      this.charId = window.location.href.split('/').pop();
    }
    this.characterService.getCharacterSignalById(this.charId);
    effect(() => {
      this.character = this.characterService.character();
      if (this.character) {
        this.verifyEditMode();
        this.calcCA();
      }
    });
  }

  @Input() public set characterId(id: string) {
    this.charId = id;
  }

  public openSidenav() {
    this.sidenavService.toggle();
  }

  public openDiceSelector() {
    this.diceSelector.open(DiceComponent);
  }

  private verifyEditMode() {
    if (!this.character) {
      return;
    }
    const userId = getAuth().currentUser.uid;
    if (userId) {
      if (userId === this.character.status.userId) {
        this.editMode = true;
      }
      if (this.character.campaignId && this.character.campaignId !== '') {
        this.campaignService.getCampaignById(this.character.campaignId).then((campaign) => {
          if (campaign.ownerId === userId) {
            this.editMode = true;
          }
        });
      }
    }
  }

  private calcCA() {
    this.character.CA = 10 + Math.floor((this.character.caratteristiche.destrezza - 10) / 2);
    const equip = this.character.equipaggiamento;
    equip.forEach((item: any) => {
      if (item.CA > 0 && !item.shield && item.weared) {
        if (item.plusDexterity) {
          this.character.CA = (item.CA + Math.floor((this.character.caratteristiche.destrezza - 10) / 2));
        } else {
          this.character.CA = item.CA;
        }
      }
      if (item.CA > 0 && item.shield && item.weared) {
        this.character.CAShield = '+ ' + item.CA;
      }
    });
  }
}


// equip.forEach((item: Item) => {
//   if (item.CA > 0 && !item.shield && item.weared) {
//     if (item.plusDexterity) {
//       this.CA = (item.CA + Math.floor((this.characterData.caratteristiche.destrezza - 10) / 2)).toString();
//     } else {
//       this.CA = item.CA.toString();
//     }
//   }
//   if (item.CA > 0 && item.shield && item.weared) {
//     this.CAShield = '+ ' + item.CA;
//   }
// });
// if (this.CA === '') {
//   this.CA = this.characterData.CA
// }