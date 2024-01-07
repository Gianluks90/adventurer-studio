import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SidenavService } from 'src/app/services/sidenav.service';
import { AddCampaignDialogComponent } from './add-campaign-dialog/add-campaign-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CampaignService } from 'src/app/services/campaign.service';
import { getAuth } from 'firebase/auth';
import { DeleteCampaignDialogComponent } from './delete-campaign-dialog/delete-campaign-dialog.component';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss'
})
export class CampaignListComponent implements OnInit{

  constructor(private sidenavService: SidenavService, private campaignService: CampaignService, private dialog: MatDialog, private platform: Platform){

  }

  ngOnInit(){
    const ownerId = getAuth().currentUser.uid;
    if (ownerId) {
      this.campaignService.getCampaignsByOwnerID(ownerId).then((result)=>{
        this.campaigns = result;
        console.log(this.campaigns);
      })
    }

  }

  public menuIcon = 'menu';
  public campaigns: any[] = [];

  public openSidenav() {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'menu';
    }
    this.sidenavService.toggle();
  }

  public createCampaigns() {
    this.dialog.open(AddCampaignDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
    }).afterClosed().subscribe((result: any) => {
      if (result && result.status === 'confirm' ) {
        const ownerId = getAuth().currentUser.uid;
        this.campaignService.addCampaign(result.title, result.password, ownerId).then(()=>{
          window.location.reload();
        });
      }
    });
  }

  public deleteCampaigns(id:string){

    this.dialog.open(DeleteCampaignDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      data: {
        id: id
      }
    }).afterClosed().subscribe((result: string) => {
      if (result === 'confirm') {
        window.location.reload();
      }
    });
  }

}
