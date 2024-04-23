import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { MenuService } from 'src/app/services/menu.service';
import { MatDrawer } from '@angular/material/sidenav';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CharacterService } from 'src/app/services/character.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  public disableSettings: boolean = true;
  public favChar: any;
  public favCampaign: any;

  constructor(
    public firebaseService: FirebaseService,
    private charService: CharacterService,
    public dialog: MatDialog,
    private authGuardService: AuthGuardService,
    private router: Router,
    public menuService: MenuService,
    private drawer: MatDrawer,
    private platform: Platform) {
    this.firebaseService.user.subscribe(user => {
      if (user && user.displayName) {
        this.disableSettings = false;
        this.charService.getCharacterById(user.favoriteCharacter).then((data) => {
          this.favChar = data;
        });
      }
    });
  }

  public logout() {
    getAuth().signOut().then(() => {
      localStorage.setItem('dndCS-2023-logged', 'false');
      this.drawer.close();
    });
  }

  public navigateToChar(id: string) {
    this.drawer.close();
    this.router.navigate(['/view', id]);
  }

  public openSettingsDialog() {
    this.dialog.open(SettingsDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      data: { token: this.firebaseService.user.value.dddiceToken, privateSlug: this.firebaseService.user.value.privateSlug }
    })
  }

  public close() {
    this.drawer.close();
  }
}
