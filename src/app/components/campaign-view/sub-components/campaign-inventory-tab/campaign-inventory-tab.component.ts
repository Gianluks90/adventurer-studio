import { Component, Input } from '@angular/core';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-campaign-inventory-tab',
  templateUrl: './campaign-inventory-tab.component.html',
  styleUrl: './campaign-inventory-tab.component.scss'
})
export class CampaignInventoryTabComponent {
  
  public isOwnerData: boolean = false;
  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  public campaignData: any;
  @Input() set campaign(campaign: any) {
    this.campaignData = campaign;
  }

  public selectedChar: string = '';
  @Input() set characters(characters: any) {
    const userId = getAuth().currentUser?.uid;
    if (characters) {
      this.selectedChar = characters.find((char: any) => char.status.userId === userId) || '';
    }
  }
}
