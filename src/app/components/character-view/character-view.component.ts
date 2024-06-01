import { Component, Input, effect } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CharacterService } from 'src/app/services/character.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { DiceComponent } from '../utilities/dice/dice.component';
import { DddiceService } from 'src/app/services/dddice.service';
import { CampaignService } from 'src/app/services/campaign.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DescriptionTooltipService } from '../utilities/description-tooltip/description-tooltip.service';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.scss']
})
export class CharacterViewComponent {

  public user: AdventurerUser | null;

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
    private firebaseService: FirebaseService,
    private characterService: CharacterService,
    private sidenavService: SidenavService,
    private diceSelector: MatBottomSheet,
    public diceService: DddiceService,
    private campaignService: CampaignService,
    breakpointObserver: BreakpointObserver,
    public tooltip: DescriptionTooltipService) {

    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (!this.user) return;
      this.characterService.getCharacterSignalById(this.charId);
    });

    effect(() => {
      this.character = this.characterService.character();
      if (!this.character) return;
      this.verifyEditMode();
      this.calcCA();
      // this.composeCharInfoString();
    });

    if (window.location.href.includes('campaign-view/')) {
      this.inCampaign = true;
    }
    breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.isMobile = result.matches;
    });

    if (this.charId === '' && !window.location.href.includes('campaign-view')) {
      this.charId = window.location.href.split('/').pop();
    }
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
    if (this.user) {
      if (this.user.id === this.character.status.userId) {
        this.editMode = true;
      }
      if (this.character.campaignId && this.character.campaignId !== '') {
        this.campaignService.getCampaignById(this.character.campaignId).then((campaign) => {
          if (campaign.ownerId === this.user.id) {
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

  public composeCharInfoString(): string {
    const infos: string[] = [];
    const info = this.character.informazioniBase;
    info.razzaPersonalizzata !== '' ? infos.push(info.razzaPersonalizzata + (info.sottorazza !== '' ? '(' + info.sottorazza + ')' : '')) : infos.push(info.razza + (info.sottorazza !== '' ? ' (' + info.sottorazza + ')' : ''));
    info.genere !== '' ? infos.push(info.genere) : null;
    info.pronomi !== '' ? infos.push(info.pronomi) : null;
    info.allineamento !== '' ? infos.push(info.allineamento) : null;
    info.background !== '' ? infos.push(info.background + (info.dettaglioBackground !== '' ? ' (' + info.dettaglioBackground + ')' : '')) : null;
  
    infos.forEach((item, index) => {
      if (!item) {
        infos.splice(index, 1);
      }
    });

    let result = infos.join(', ');
    return result;
  }
}