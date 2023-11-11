import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { MenuService } from 'src/app/services/menu.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DiceService } from 'src/app/services/dice.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent{

  public roomExist: boolean = false;

  constructor(
    public firebaseService: FirebaseService,
    public dialog: MatDialog,
    private authGuardService: AuthGuardService,
    public menuService: MenuService,
    private drawer: MatDrawer,
    private diceService: DiceService) {
    }

    ngOnInit(){
      this.firebaseService.getUser(getAuth().currentUser).then(res => {
        this.roomExist = res.data()["dddice_RoomSlug"] !== "" ? true : false;
        if(this.roomExist){
          this.diceService.getRoom(res.data()["dddice_RoomSlug"])
        }
      });
      
    }

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

  public toggle(e: any){
    if(e.checked){
      this.diceService.createRoom();
    } else {
      this.diceService.destroyRoom();
    }
  }
}
