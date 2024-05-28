import { Component, OnInit, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SidenavService } from 'src/app/services/sidenav.service';
import { AddCampaignDialogComponent } from './add-campaign-dialog/add-campaign-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CampaignService } from 'src/app/services/campaign.service';
import { DeleteCampaignDialogComponent } from './delete-campaign-dialog/delete-campaign-dialog.component';
import { TicketCampaignDialogComponent } from './ticket-campaign-dialog/ticket-campaign-dialog.component';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss'
})
export class CampaignListComponent {

  public user: AdventurerUser | null;
  public menuIcon = 'menu';
  public ownedCampaigns: any[] = [];
  public partecipantCampaigns: any[] = [];
  public today: Date = new Date();

  constructor(public firebaseService: FirebaseService, public sidenavService: SidenavService, private campaignService: CampaignService, private dialog: MatDialog, private platform: Platform) {
    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (this.user) {
        this.campaignService.getUserCampaigns().then((result) => {
          this.ownedCampaigns = result.asOwner;
          this.partecipantCampaigns = result.asPartecipant;
          this.sortCampaignsByLastUpdate(this.ownedCampaigns);
          this.sortCampaignsByLastUpdate(this.partecipantCampaigns);
        });
      }
    });
  }

  private sortCampaignsByLastUpdate(list: any[]) {
    return list.sort((a, b) => {
      if (a.lastUpdate > b.lastUpdate) {
        return -1;
      } else if (a.lastUpdate < b.lastUpdate) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  public createCampaigns() {
    this.dialog.open(AddCampaignDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
    }).afterClosed().subscribe((result: any) => {
      if (result && result.status === 'confirm') {
        this.campaignService.addCampaign(result).then(() => {
          window.location.reload();
        });
      }
    });
  }

  public deleteCampaigns(id: string) {

    this.dialog.open(DeleteCampaignDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      data: {
        id: id
      }
    }).afterClosed().subscribe((result: string) => {
      if (result === 'confirm') {
        window.location.reload();
      }
    });
  }

  public ticketCampaign() {
    this.dialog.open(TicketCampaignDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false
    }).afterClosed().subscribe((result: any) => {
      if (result && result.status === 'success') {
        window.location.reload();
      }
    });
  }

}
