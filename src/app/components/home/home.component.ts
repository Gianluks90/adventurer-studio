import { Component } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(public firebaseService: FirebaseService) {}

  public logout() {
    getAuth().signOut();
    // window.location.reload();
  }
}
