import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { MenuService } from 'src/app/services/menu.service';
import { MatDrawer } from '@angular/material/sidenav';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  public disableSettings: boolean = true;

  constructor(
    public firebaseService: FirebaseService,
    public dialog: MatDialog,
    private authGuardService: AuthGuardService,
    public menuService: MenuService,
    private drawer: MatDrawer,
    private platform: Platform) {
      this.firebaseService.user.subscribe(user => {
       if(user && user.displayName){
        this.disableSettings = false;
       } 
      });
  }

  ngOnInit() { }

  public logout() {
    getAuth().signOut().then(() => {
      localStorage.setItem('dndCS-2023-logged', 'false');
      this.drawer.close();
    });
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
