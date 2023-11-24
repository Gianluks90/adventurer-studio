import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { MenuService } from 'src/app/services/menu.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  public roomExist: boolean = false;

  constructor(
    public firebaseService: FirebaseService,
    public dialog: MatDialog,
    private authGuardService: AuthGuardService,
    public menuService: MenuService,
    private drawer: MatDrawer,) {
  }

  ngOnInit() { }

  public logout() {
    getAuth().signOut().then(() => {
      localStorage.setItem('dndCS-2023-logged', 'false');
      this.drawer.close();
      this.authGuardService.authStatus = false
    });
  }

  public close() {
    this.drawer.close();
  }
}
