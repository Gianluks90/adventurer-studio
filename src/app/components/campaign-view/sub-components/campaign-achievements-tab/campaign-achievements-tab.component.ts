import { Platform } from '@angular/cdk/platform';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { AddAchievementDialogComponent } from './add-achievement-dialog/add-achievement-dialog.component';

@Component({
  selector: 'app-campaign-achievements-tab',
  templateUrl: './campaign-achievements-tab.component.html',
  styleUrl: './campaign-achievements-tab.component.scss'
})
export class CampaignAchievementsTabComponent {

  public achievementsData: any[];
  public isOwnerData: boolean = false;
  public charactersData: any[];

  constructor(private dialog: MatDialog, private platform: Platform, private campaignService: CampaignService) {}

  @Input() set achievements(achievements: any) {
    this.achievementsData = achievements;
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  @Input() set characters(characters: any) {
    this.charactersData = characters;
  }

  public openAchievementDialog(achievement?: any, index?: number) {
    this.dialog.open(AddAchievementDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { achievement: achievement, characters: this.charactersData }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.campaignService.addAchievement(window.location.href.split('/').pop(), result.rule).then(() => {
            this.achievementsData = this.sortRuleAlphabetical(this.achievementsData);
          });
        break;
        case 'edited':
          this.achievementsData[index] = result.rule;
          this.campaignService.updateCampaignAchievement(window.location.href.split('/').pop(), this.achievementsData);
        break;
        case 'deleted':
          this.achievementsData.splice(index, 1);
          this.campaignService.updateCampaignAchievement(window.location.href.split('/').pop(), this.achievementsData);
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
