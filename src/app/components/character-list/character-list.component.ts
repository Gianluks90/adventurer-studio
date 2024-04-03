import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { CharacterService } from 'src/app/services/character.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { DeleteCharacterDialogComponent } from './delete-character-dialog/delete-character-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { AddCharacterDialogComponent } from './add-character-dialog/add-character-dialog.component';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {

  public characters: any[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private characterService: CharacterService,
    private sidenavService: SidenavService,
    private dialog: MatDialog,
    private platform: Platform) { }

  public menuIcon = 'menu';

  ngOnInit(): void {
    // const userId = getAuth().currentUser?.uid;
    this.firebaseService.user.subscribe(user => {
      // console.log('user pippo', user); 
      if (user && user.id) {
        this.characterService.getCharactersByUserId(user.id).then(result => {
          this.characters = result;
          // console.log('result', result);
        });
      }
    });
    // if (userId) {
    //   this.characterService.getCharactersByUserId(userId).then(result => {
    //     this.characters = result;
    //   })
    //   // this.characterService.getCharacters().then(result => {
    //   //   this.characters = result;
    //   // });
    // }
  }

  public openSidenav() {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'menu';
    }
    this.sidenavService.toggle();
  }

  public deleteCharacter(id: string) {
    this.dialog.open(DeleteCharacterDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      data: {
        id: id
      }
    }).afterClosed().subscribe((result: string) => {
      if (result === 'confirm') {
        window.location.reload();
      }
    });
  }

  public createCharacter() {
    this.dialog.open(AddCharacterDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
    }).afterClosed().subscribe((result: string) => {
      if (result === 'confirm') {
        window.location.reload();
        // this.router.navigate(['/create', this.firebaseService.user.value!.id + '-' + (this.firebaseService.user.value!.progressive + 1)]).then(() => {
        // window.location.reload();
        // });
      }
    });
  }
}
