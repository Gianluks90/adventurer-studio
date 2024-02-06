import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddStoryDialogComponent } from './add-story-dialog/add-story-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
  selector: 'app-campaign-story-tab',
  templateUrl: './campaign-story-tab.component.html',
  styleUrl: './campaign-story-tab.component.scss'
})
export class CampaignStoryTabComponent {

  public descriptionData: string = '';
  public storyData: any[] = [];
  public isOwnerData: boolean = false;

  constructor(private dialog: MatDialog, private platform: Platform, private campaignService: CampaignService) {}

  @Input() set description(value: string) {
    this.descriptionData = value;
  }

  @Input() set story(value: any[]) {
    this.storyData = value;
    this.storyData = this.sortStoryByLastUpdate(this.storyData);
  }

  @Input() set isOwner(value: boolean) {
    this.isOwnerData = value;
  }

  public openStoryDialog(story?: any, index?: number) {
    this.dialog.open(AddStoryDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { story: story }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.campaignService.updateCampaignStory(window.location.href.split('/').pop(), result.story).then(() => {
            this.storyData = this.sortStoryByLastUpdate(this.storyData);
          });
        break;
        case 'edited':
          this.storyData[index] = result.story;
          this.campaignService.updateCampaignStory(window.location.href.split('/').pop(), this.storyData);
        break;
        default:
        break;
      }
    });
  }

  private sortStoryByLastUpdate(list: any[]) {
    if (list.length > 0) {
      return list.sort((a, b) => {
        if (a.lastUpdate > b.lastUpdate) {
          return -1;
        } else if (a.lastUpdate < b.lastUpdate) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      return list;
    }
  }
}
