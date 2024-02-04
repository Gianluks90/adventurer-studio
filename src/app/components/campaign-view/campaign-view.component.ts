import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { CampaignService } from 'src/app/services/campaign.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { TicketCampaignDialogComponent } from '../campaign-list/ticket-campaign-dialog/ticket-campaign-dialog.component';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrl: './campaign-view.component.scss'
})
export class CampaignViewComponent {
  public campaignData: any;
  public isOwner: boolean = false;

  constructor(private campaignService: CampaignService, private sidenavService: SidenavService, private matDialog: MatDialog, private platform: Platform) {
    const id = window.location.href.split('/').pop();
    this.campaignService.getCampaignById(id).then((data) => {
      this.campaignData = data;
      // console.log(this.campaignData);
      
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
    });
  }

  public openSidenav() {
    this.sidenavService.toggle();
  }

  public openDiceSelector(): void { }
}
