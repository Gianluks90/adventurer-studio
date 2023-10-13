import { Platform } from '@angular/cdk/platform';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddCharacterDialogComponent } from './add-character-dialog/add-character-dialog.component';
import { FormService } from 'src/app/services/form.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { MenuService } from 'src/app/services/menu.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  public characters: any[] = [];

  constructor(
    public firebaseService: FirebaseService,
    private formService: FormService,
    private router:Router,
    public dialog: MatDialog,
    private platform: Platform,
    private authGuardService: AuthGuardService,
    public menuService: MenuService,
    private drawer: MatDrawer) {}

  public logout() {
    getAuth().signOut().then(()=>{
      localStorage.setItem('dndCS-2023-logged','false');
      this.drawer.close();
      this.authGuardService.authStatus = false
    });
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

  public saveDraft(): void {
    const charId = window.location.href.split('/').pop();
    this.formService.saveDraft(charId!, this.formService.formSubject.value).then(() => {
      console.log(charId!, this.formService.formSubject.value);

      alert('Salvataggio effettuato');
    })
  }
}
