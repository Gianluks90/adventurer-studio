import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { AuthGuardService } from './services/auth-guard.service';
import { V } from '@angular/cdk/keycodes';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from './services/sidenav.service';
import { DddiceService } from './services/dddice.service';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Adventurer Studio';
  showFiller = false;

  @ViewChild('drawer') public sidenav: MatSidenav;

  constructor(
    private firebaseService: FirebaseService,
    public authGuardService: AuthGuardService,
    private sidenavService: SidenavService,
    private dddiceService: DddiceService) { }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
