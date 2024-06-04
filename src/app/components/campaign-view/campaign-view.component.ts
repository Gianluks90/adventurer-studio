import { Component, ViewChild, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Platform } from '@angular/cdk/platform';
import { TicketCampaignDialogComponent } from '../campaign-list/ticket-campaign-dialog/ticket-campaign-dialog.component';
import { getAuth } from 'firebase/auth';
import { CharacterService } from 'src/app/services/character.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DiceComponent } from '../utilities/dice/dice.component';
import { NextSessionDialogComponent } from './next-session-dialog/next-session-dialog.component';
import { DescriptionTooltipService } from '../utilities/description-tooltip/description-tooltip.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AdventurerUser } from 'src/app/models/adventurerUser';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrl: './campaign-view.component.scss'
})
export class CampaignViewComponent {
  public user: AdventurerUser | null;

  public campaignData: any;
  public charData: any[] = [];
  public isOwner: boolean = false;
  public selectedChar: any;
  public sessionNumber: number = 1;
  public today = new Date();
  public isiPad: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private diceSelector: MatBottomSheet,
    private campaignService: CampaignService,
    private sidenavService: SidenavService,
    private matDialog: MatDialog,
    private charService: CharacterService,
    public tooltip: DescriptionTooltipService,
    private platform: Platform) {

    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (!this.user) return;
      this.charService.getSignalCharacters();
      if (this.platform.SAFARI) {
        this.isiPad = true;
        
      }
    });

    effect(() => {
      this.charData = this.charService.campaignCharacters();
      if (!this.charData && !this.user) return;

      const id = window.location.href.split('campaign-view/').pop();
      this.charData = this.charData.filter((char: any) => char.campaignId === id);
      this.charData.sort((a, b) => a.informazioniBase.nomePersonaggio.localeCompare(b.informazioniBase.nomePersonaggio));
      this.charData.forEach((char) => {
        if (char.status.userId === this.user.id) {
          this.selectedChar = char;
        }
      });

      // if (!this.campaignData) {
        this.campaignService.getSignalSingleCampaing(id);
      // }
    });

    effect(() => {
      const campaigns = this.campaignService.campaigns();
      if (campaigns.length <= 0) return;

      const id = window.location.href.split('campaign-view/').pop();
      this.campaignData = campaigns.find((campaign: any) => campaign.id === id);
      if (!this.campaignData) return;
      this.campaignData.id = id;
      this.calcSessionNumber();
      this.isOwner = this.user.id === this.campaignData.ownerId;
      if (!this.isOwner) {
        const alreadyJoined = this.campaignData.partecipants.find((player: any) => player === this.user.id);
        if (!alreadyJoined) {
          this.matDialog.open(TicketCampaignDialogComponent, {
            width: window.innerWidth < 768 ? '90%' : '60%',
            autoFocus: false,
            disableClose: true,
          }).afterClosed().subscribe((result) => {
            if (result && result.status === 'success') {
              window.location.reload();
            }
          });
        }
      }
    });
  }

  @ViewChild('tabGroup') tabGroup: any;
  public onCharEmitted(charId: string) {
    console.log('sono il DM', charId);
    this.selectedChar = this.charData.find((char) => char.id === charId);
    this.tabGroup.selectedIndex = 2;
  }

  public openSidenav() {
    this.sidenavService.toggle();
  }

  public openDiceSelector(): void {
    this.diceSelector.open(DiceComponent);
  }

  private calcSessionNumber() {
    let result = this.campaignData.story.length;
    this.campaignData.archive.forEach((element: any) => {
      result += element.story.length;
    });
    this.sessionNumber = result;
  }

  public openNextSessionDialog() {
    this.matDialog.open(NextSessionDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '30%',
      autoFocus: false,
    });
  }
}
