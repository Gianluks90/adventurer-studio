import { Component, Input } from '@angular/core';
import { CampaignService } from 'src/app/services/campaign.service';
import { DddiceService } from 'src/app/services/dddice.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-campaign-settings-tab',
  templateUrl: './campaign-settings-tab.component.html',
  styleUrl: './campaign-settings-tab.component.scss'
})
export class CampaignSettingsTabComponent {

  constructor(
    private campaignService: CampaignService, 
    private dddiceService: DddiceService, 
    private firebaseService: FirebaseService) {}
  
  public campaignData: any;
  public isOwnerData: boolean = false;

  @Input() set campaign(data: any) {
    this.campaignData = data;
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  public startCampaign(): void {
    this.campaignService.startCampaign(this.campaignData.id);
  }

  public createCampaignRoom(): void {
    this.firebaseService.getUserDDDiceToken().then(token => {
      this.dddiceService.createRoom(token, this.campaignData.id, this.campaignData.password).then((room) => {
        this.campaignService.setDDDiceRoomSlug(this.campaignData.id, room.data.slug);
      });
    });
  }

}
