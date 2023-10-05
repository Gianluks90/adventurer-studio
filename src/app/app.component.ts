import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { AuthGuardService } from './services/auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dndCharacterSheet';
  public isLogged:boolean = false
  constructor(private firebaseService: FirebaseService, private authGuardService: AuthGuardService) {}

  ngOnInit(): void {
    this.authGuardService.emitterlogStatus.subscribe((status)=>{
      this.isLogged = status
    });
    if(localStorage.getItem('dndCS-2023-logged') === 'true'){
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }
}
