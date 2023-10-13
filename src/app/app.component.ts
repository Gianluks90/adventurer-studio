import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { AuthGuardService } from './services/auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Adventurer Studio';
  showFiller = false;

  constructor(private firebaseService: FirebaseService, public authGuardService: AuthGuardService) { }
  ngOnInit(): void {
    // console.log('status', this.authGuardService.authStatus);
  }
}
