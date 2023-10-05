import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { FormModel } from 'src/app/models/formModel';
import { CharacterService } from 'src/app/services/character.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddCharacterDialogComponent } from '../sidenav/add-character-dialog/add-character-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public characters: any[] = [];

  constructor(
    public firebaseService: FirebaseService,
    private router:Router,
    public dialog: MatDialog,
    private platform: Platform,
    private authGuardService:AuthGuardService) {}

  public logout() {
    getAuth().signOut();
    this.authGuardService.logStatus(false);
    // window.location.reload();
  }

  public createCharacter(){
    this.dialog.open(AddCharacterDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
    }).afterClosed().subscribe((result: string) => {
      if (result === 'confirm') {
      this.router.navigate(['/edit', this.firebaseService.user.value!.id + '-' + (this.firebaseService.user.value!.progressive + 1)])
      }
    });
  }
}
