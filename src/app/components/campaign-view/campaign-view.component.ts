import { Component, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Platform } from '@angular/cdk/platform';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TicketCampaignDialogComponent } from '../campaign-list/ticket-campaign-dialog/ticket-campaign-dialog.component';
import { getAuth } from 'firebase/auth';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrl: './campaign-view.component.scss'
})
export class CampaignViewComponent {
  public campaignData: any;
  public charData: any[] = [];
  public isOwner: boolean = false;

  constructor(
    private firebaseService: FirebaseService, 
    private campaignService: CampaignService, 
    private sidenavService: SidenavService, 
    private matDialog: MatDialog, 
    private platform: Platform, 
    private charService: CharacterService) {

    const id = window.location.href.split('campaign-view/').pop();
    effect(() => {
      this.campaignData = this.campaignService.campaigns();
      this.campaignData = this.campaignData.find((campaign: any) => campaign.id === id);
      if (this.campaignData) {
        this.campaignData.id = id;
        this.isOwner = getAuth().currentUser?.uid === this.campaignData.ownerId;
        if (!this.isOwner) {
          const alreadyJoined = this.campaignData.partecipants.find((player: any) => player === getAuth().currentUser?.uid);
          if (!alreadyJoined) {
            this.matDialog.open(TicketCampaignDialogComponent, {
              width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
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
    });
    effect(() => {
      this.charData = this.charService.campaignCharacters();
      this.charData = this.charData.filter((char: any) => char.campaignId === id);
    });
  }

  public openSidenav() {
    this.sidenavService.toggle();
  }

  public openDiceSelector(): void { }
}
