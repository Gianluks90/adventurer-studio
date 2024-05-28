import { Component, effect } from '@angular/core';
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

  constructor(
    private firebaseService: FirebaseService,
    private diceSelector: MatBottomSheet,
    private campaignService: CampaignService,
    private sidenavService: SidenavService,
    private matDialog: MatDialog,
    private charService: CharacterService,
    public tooltip: DescriptionTooltipService) {

    const id = window.location.href.split('campaign-view/').pop();
    this.campaignService.getSignalSingleCampaing(id);
    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (this.user) {
        this.campaignData = this.campaignService.campaigns();
        this.campaignData = this.campaignData.find((campaign: any) => campaign.id === id);
        if (this.campaignData) {
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
        }
      }
    });
    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (this.user) {
        this.charData = this.charService.campaignCharacters();
        this.charData = this.charData.filter((char: any) => char.campaignId === id);
        this.charData.sort((a, b) => a.informazioniBase.nomePersonaggio.localeCompare(b.informazioniBase.nomePersonaggio));
        this.charData.forEach((char) => {
          if (char.status.userId === this.user.id) {
            this.selectedChar = char;
          }
        });
      }
    });
  }

  public openSidenav() {
    this.sidenavService.toggle();
  }

  public openDiceSelector(): void {this.diceSelector.open(DiceComponent);
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
