import { Component } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { CampaignService } from 'src/app/services/campaign.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrl: './campaign-view.component.scss'
})
export class CampaignViewComponent {
  public campaignData: any;
  public isOwner: boolean = false;

  constructor(private campaignService: CampaignService, private sidenavService: SidenavService) {
    const id = window.location.href.split('/').pop();
    this.campaignService.getCampaignById(id).then((data) => {
      this.campaignData = data;
      this.campaignData.id = id;
      this.isOwner = getAuth().currentUser?.uid === this.campaignData.ownerId;
    });
  }

  public openSidenav() {
    this.sidenavService.toggle();
  }

  public openDiceSelector(): void {}
}
