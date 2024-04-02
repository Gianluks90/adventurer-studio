import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-campaign-npc-tab',
  templateUrl: './campaign-npc-tab.component.html',
  styleUrl: './campaign-npc-tab.component.scss'
})
export class CampaignNpcTabComponent {

  public campaignData: any;
  public isOwnerData: boolean = false;

  @Input() set campaign(data: any) {
    this.campaignData = data;
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }
}
