import { Component, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDrawer } from '@angular/material/sidenav';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { CharacterService } from 'src/app/services/character.service';
import { Router } from '@angular/router';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  public user: AdventurerUser = new AdventurerUser();
  // public disableSettings: boolean = true;
  public favChar: any;
  public favCampaign: any;

  constructor(
    private firebaseService: FirebaseService,
    private charService: CharacterService,
    private campService: CampaignService,
    public dialog: MatDialog,
    private router: Router,
    private drawer: MatDrawer) {

    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (this.user) {
        if (this.user.favoriteCharacter !== '') {
          this.charService.getCharacterById(this.user.favoriteCharacter).then((data) => {
            this.favChar = data;
          });
        }
        if (this.user.favoriteCampaign !== '') {
          this.campService.getCampaignById(this.user.favoriteCampaign).then((data) => {
            this.favCampaign = data;
          });
        }
      }
    });
  }

  public logout() {
    getAuth().signOut().then(() => {
      localStorage.setItem('dndCS-2023-logged', 'false');
      this.drawer.close();
      this.router.navigate(['/']);
    });
  }

  public navigateToChar(id: string) {
    this.drawer.close();
    this.router.navigate(['/view', id]);
  }

  public openSettingsDialog() {
    this.dialog.open(SettingsDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      data: { token: this.user.dddiceToken, privateSlug: this.user.privateSlug }
    })
  }

  public close() {
    this.drawer.close();
  }
}
