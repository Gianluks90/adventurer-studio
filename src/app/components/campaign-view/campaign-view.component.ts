import { Component, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Platform } from '@angular/cdk/platform';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TicketCampaignDialogComponent } from '../campaign-list/ticket-campaign-dialog/ticket-campaign-dialog.component';
import { getAuth } from 'firebase/auth';
import { CharacterService } from 'src/app/services/character.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DiceComponent } from '../utilities/dice/dice.component';
import { DddiceService } from 'src/app/services/dddice.service';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrl: './campaign-view.component.scss'
})
export class CampaignViewComponent {
  public campaignData: any;
  public charData: any[] = [];
  public isOwner: boolean = false;
  public partecipantIndex: number = -1;

  constructor(
    private firebaseService: FirebaseService,
    private diceSelector: MatBottomSheet,
    private campaignService: CampaignService,
    private sidenavService: SidenavService,
    private matDialog: MatDialog,
    private platform: Platform,
    private charService: CharacterService,
    private dddiceService: DddiceService) {

    const id = window.location.href.split('campaign-view/').pop();
    effect(() => {
      this.campaignData = this.campaignService.campaigns();
      this.campaignData = this.campaignData.find((campaign: any) => campaign.id === id);
      if (this.campaignData) {
        this.campaignData.id = id;
        // if (this.campaignData.dddiceSlug && this.campaignData.dddiceSlug !== '') {
        //   this.firebaseService.getUserById(getAuth().currentUser.uid).then((user) => {
        //     this.dddiceService.dddiceCampaignInit(user.data()['dddiceToken']).then((dddice) => {
        //       dddice.connect(this.campaignData.dddiceSlug);
        //     });
        //   });
        // }

        const userId = getAuth().currentUser?.uid;
        this.isOwner = userId === this.campaignData.ownerId;
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
      this.charData.sort((a, b) => a.informazioniBase.nomePersonaggio.localeCompare(b.informazioniBase.nomePersonaggio));
      this.partecipantIndex = this.charData.findIndex((char: any) => char.status.userId === getAuth().currentUser?.uid);
    });
  }

  public openSidenav() {
    this.sidenavService.toggle();
  }

  public openDiceSelector(): void {
    // this.firebaseService.getUserById(this.campaignData.ownerId).then((user) => {
    //   this.dddiceService.connectPrivateRoom(user.data()['dddiceToken'], user.data()['privateSlug']);
    // });
    // this.dddiceService.dddice.connect(this.campaignData.dddiceSlug);
    this.diceSelector.open(DiceComponent);
  }
}
