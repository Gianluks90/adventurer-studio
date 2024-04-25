import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { DddiceService } from 'src/app/services/dddice.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NewChapterDialogComponent } from './new-chapter-dialog/new-chapter-dialog.component';
import { RemoveCharDialogComponent } from './remove-char-dialog/remove-char-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemoveCampaignDialogComponent } from './remove-campaign-dialog/remove-campaign-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign-settings-tab',
  templateUrl: './campaign-settings-tab.component.html',
  styleUrl: './campaign-settings-tab.component.scss'
})
export class CampaignSettingsTabComponent {

  constructor(
    private campaignService: CampaignService,
    private dddiceService: DddiceService,
    private firebaseService: FirebaseService,
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private router: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  public campaignData: any;
  public charData: any;
  public isOwnerData: boolean = false;

  public form: FormGroup;

  @Input() set campaign(data: any) {
    this.campaignData = data;
    this.form.get('title').setValue(data.title);
    this.form.get('description').setValue(data.description);
  }

  @Input() set characters(data: any) {
    this.charData = data;
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  public startCampaign(): void {
    this.campaignService.startCampaign(this.campaignData.id).then(() => {
      window.location.reload();
    });
  }

  public createCampaignRoom(): void {
    this.firebaseService.getUserDDDiceToken().then(token => {
      this.dddiceService.createRoom(token, this.campaignData.id, this.campaignData.password).then((room) => {
        this.campaignService.setDDDiceRoomSlug(this.campaignData.id, room.data.slug);
      });
    });
  }

  public openNewChapterDialog(): void {
    this.matDialog.open(NewChapterDialogComponent, {
      width: window.innerWidth < 768 ? '80%' : '50%',
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe((result: any) => {
      if (result.status !== 'success') return;
      this.campaignService.newChapter(window.location.href.split('/').pop(), this.campaignData, result.title, result.description);
    });
  }

  public openRemoveCharDialog(index: number): void {
    this.matDialog.open(RemoveCharDialogComponent, {
      width: window.innerWidth < 768 ? '80%' : '50%',
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe((result: any) => {
      if (result !== 'success') return;
      const charId = this.charData[index].id;
      const character = this.campaignData.characters.find((char: any) => char.id === charId);
      this.campaignService.removeChar(this.campaignData.id, character).then(() => {
        console.log('Char removed');
      });
    });
  }

  public openRemoveCampaignDialog(): void {
    this.matDialog.open(RemoveCampaignDialogComponent, {
      width: window.innerWidth < 768 ? '80%' : '50%',
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe((result: any) => {
      if (result !== 'success') return;
      const requests = this.campaignData.characters.map((char: any) => {
        return this.campaignService.removeChar(this.campaignData.id, char);
      });
      Promise.all(requests).then(() => {
        this.campaignService.deleteCampaignById(this.campaignData.id).then(() => {
          this.router.navigate(['/campaigns']);
        });
      });
    });
  }

  public editTitleDescription(): void {
    this.campaignService.editTitleDescription(this.campaignData.id, this.form.value);
  }

}
