import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { DddiceService } from 'src/app/services/dddice.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NewChapterDialogComponent } from './new-chapter-dialog/new-chapter-dialog.component';

@Component({
  selector: 'app-campaign-settings-tab',
  templateUrl: './campaign-settings-tab.component.html',
  styleUrl: './campaign-settings-tab.component.scss'
})
export class CampaignSettingsTabComponent {

  constructor(
    private campaignService: CampaignService, 
    private dddiceService: DddiceService, 
    private firebaseService: FirebaseService,
    private matDialog: MatDialog) {}
  
  public campaignData: any;
  public isOwnerData: boolean = false;

  @Input() set campaign(data: any) {
    this.campaignData = data;
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  public startCampaign(): void {
    this.campaignService.startCampaign(this.campaignData.id).then(() => {
      window.location.reload();
    });
  }

  public createCampaignRoom(): void {
    this.firebaseService.getUserDDDiceToken().then(token => {
      this.dddiceService.createRoom(token, this.campaignData.id, this.campaignData.password).then((room) => {
        this.campaignService.setDDDiceRoomSlug(this.campaignData.id, room.data.slug);
      });
    });
  }

  public openNewChapterDialog(): void {
    this.matDialog.open(NewChapterDialogComponent, {
      width: window.innerWidth < 600 ? '80%' : '50%',
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe((result: any) => {
      if (result.status !== 'success') return;
      this.campaignService.newChapter(window.location.href.split('/').pop(), this.campaignData, result.title, result.description);
    });
  }

}
