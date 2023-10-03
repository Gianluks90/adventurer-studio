import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { FormModel } from 'src/app/models/formModel';
import { CharacterService } from 'src/app/services/character.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddCharacterDialogComponent } from './add-character-dialog/add-character-dialog.component';
import { Platform } from '@angular/cdk/platform';

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
    private platform: Platform) {}

  public logout() {
    getAuth().signOut();
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
