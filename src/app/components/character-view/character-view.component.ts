import { Component, Input, effect } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { CampaignService } from 'src/app/services/campaign.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DescriptionTooltipService } from '../utilities/description-tooltip/description-tooltip.service';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DiceRollerComponent } from '../utilities/dice-roller/dice-roller.component';

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

  public prideFlag: any;

  constructor(
    // private menuService: MenuService,
    private firebaseService: FirebaseService,
    private characterService: CharacterService,
    private sidenavService: SidenavService,
    private campaignService: CampaignService,
    public breakpointObserver: BreakpointObserver,
    public tooltip: DescriptionTooltipService,
    private http: HttpClient,
    private matDialog: MatDialog) {

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
      this.calcBonus();

      this.http.get('./assets/settings/inclusivityFlags.json').subscribe((data: any[]) => {
        this.prideFlag = data.find((flag) => flag.name === this.character.status.prideFlag) || null;
      });
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

  private calcBonus() {
    const bonuses = this.character.privilegiTratti.flatMap((privilegioTratto: any) => privilegioTratto.bonuses).filter((bonus: any) => bonus !== undefined);
    bonuses.forEach((bonus: any) => {
      if (bonus.element === 'punti ferita') {
        this.character.parametriVitali.massimoPuntiFerita += bonus.value;
        if (this.character.parametriVitali.puntiFeritaAttuali > this.character.parametriVitali.massimoPuntiFerita) {
          this.character.parametriVitali.puntiFeritaAttuali = this.character.parametriVitali.massimoPuntiFerita;
        }
      }
      if (bonus.element === 'velocità') {
        this.character.velocita += bonus.value;
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

  public openDiceRoller() {
    this.matDialog.open(DiceRollerComponent, {
      width: window.innerWidth < 768 ? '90%' : '500px',
      autoFocus: false,
      disableClose: true,
      data: {
        char: this.character,
        formula: null
      }
    });
  }
}