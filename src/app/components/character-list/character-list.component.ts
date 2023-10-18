import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { CharacterService } from 'src/app/services/character.service';
import { MenuService } from 'src/app/services/menu.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {


  public characters: any[] = [];

  constructor(
    private characterService: CharacterService,
    private sidenavService: SidenavService) { }

  public menuIcon = 'menu';


  ngOnInit(): void {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      this.characterService.getCharactersByUserId(userId).then(result => {
        this.characters = result;
      })
    }
  }

  ngAfterViewInit(): void {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'close';
    }
  }


  public openSidenav() {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'menu';
    }
    this.sidenavService.toggle();
  }

}
