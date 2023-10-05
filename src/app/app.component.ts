import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { AuthGuardService } from './services/auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dndCharacterSheet';
  constructor(private firebaseService: FirebaseService, public authGuardService: AuthGuardService) {}
}
