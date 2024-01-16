import { Component } from '@angular/core';
import { CampaignService } from 'src/app/services/campaign.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrl: './campaign-view.component.scss'
})
export class CampaignViewComponent {
  public campaignData: any;

  constructor(private campaignService: CampaignService, private sidenavService: SidenavService) {
    const id = window.location.href.split('/').pop();
    this.campaignService.getCampaignById(id).then((data) => {
      this.campaignData = data;
    });
  }

  public openSidenav() {
    this.sidenavService.toggle();
  }

  public openDiceSelector(): void {}
}
