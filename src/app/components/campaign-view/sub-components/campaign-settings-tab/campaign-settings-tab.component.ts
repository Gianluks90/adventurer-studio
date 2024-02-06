import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-campaign-settings-tab',
  templateUrl: './campaign-settings-tab.component.html',
  styleUrl: './campaign-settings-tab.component.scss'
})
export class CampaignSettingsTabComponent {

  public campaignData: any;
  public isOwnerData: boolean = false;

  @Input() set campaign(data: any) {
    this.campaignData = data;
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }


}
