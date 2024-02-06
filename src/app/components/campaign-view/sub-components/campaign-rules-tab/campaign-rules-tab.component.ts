import { Platform } from '@angular/cdk/platform';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRuleDialogComponent } from './add-rule-dialog/add-rule-dialog.component';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
  selector: 'app-campaign-rules-tab',
  templateUrl: './campaign-rules-tab.component.html',
  styleUrl: './campaign-rules-tab.component.scss'
})
export class CampaignRulesTabComponent {

  public rulesData: any[] = [];
  public isOwnerData: boolean;

  @Input() set rules(rules: any[]) {
    this.rulesData = rules;
    this.rulesData = this.sortRuleAlphabetical(this.rulesData);
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  constructor(private dialog: MatDialog, private platform: Platform, private campaignService: CampaignService) {}

  public openRuleDialog(rule?: any, index?: number) {
    console.log('openRuleDialog', rule, index);
    
    this.dialog.open(AddRuleDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { rule: rule }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.campaignService.addRule(window.location.href.split('/').pop(), result.rule).then(() => {
            this.rulesData = this.sortRuleAlphabetical(this.rulesData);
          });
        break;
        case 'edited':
          this.rulesData[index] = result.rule;
          this.campaignService.updateCampaignRule(window.location.href.split('/').pop(), this.rulesData);
        break;
        case 'deleted':
          this.rulesData.splice(index, 1);
          this.campaignService.updateCampaignRule(window.location.href.split('/').pop(), this.rulesData);
        break;
        default:
        break;
      }
    });
  }

  private sortRuleAlphabetical(list: any[]) {
    return list.sort((a, b) => a.title.localeCompare(b.title));
  }
}
